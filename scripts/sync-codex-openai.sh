#!/bin/bash
# sync-codex-openai.sh — re-import the Codex CLI's ChatGPT OAuth tokens into
# OpenCode's credential store, replacing any previously imported copy.
#
# Never prints token values. Exits 0 on success, non-zero on any failure.
set -euo pipefail

LABEL="ChatGPT plan (imported from Codex)"
CODEX_AUTH="$HOME/.codex/auth.json"

fail() {
  echo "SYNC FAILED: $*" >&2
  exit 1
}

# --- 1. Codex must have usable tokens ---------------------------------------
[ -f "$CODEX_AUTH" ] || fail "no Codex auth file at $CODEX_AUTH (Codex CLI is not logged in)"
jq -e '.tokens.access_token | type == "string" and length > 20' "$CODEX_AUTH" >/dev/null 2>&1 \
  || fail "Codex auth file has no usable access token (Codex CLI needs to re-login)"

# --- 2. Remove previously imported credentials (by label, only ours) --------
OLD_IDS=$(opencode api get /api/credential 2>/dev/null \
  | jq -r --arg l "$LABEL" '.data[]? | select(.integrationID == "openai" and .label == $l) | .id') || true
while IFS= read -r id; do
  [ -n "$id" ] || continue
  opencode api delete "/api/credential/$id" >/dev/null 2>&1 \
    || echo "WARN: could not delete old credential $id (continuing)"
done <<< "$OLD_IDS"

# --- 3. Import Codex's current tokens ---------------------------------------
EXP=$(jq -r '
  .tokens.access_token
  | split(".")[1]
  | gsub("-"; "+") | gsub("_"; "/")
  | if   length % 4 == 1 then . + "==="
    elif length % 4 == 2 then . + "=="
    elif length % 4 == 3 then . + "="
    else . end
  | @base64d | fromjson | .exp // empty' "$CODEX_AUTH" 2>/dev/null)
[ -n "$EXP" ] || EXP=$(date +%s)

BODY=$(jq -n \
  --slurpfile c "$CODEX_AUTH" \
  --argjson e "$((EXP * 1000))" \
  '{integrationID:"openai", label:$l, activate:true, value:{
      type:"oauth", methodID:"chatgpt-headless",
      refresh:$c[0].tokens.refresh_token, access:$c[0].tokens.access_token,
      expires:($e * 1000), metadata:{accountID:$c[0].tokens.account_id}}}' \
  --arg l "$LABEL")

NEW=$(opencode api post /api/credential -d "$BODY" 2>/dev/null \
  | jq -r 'walk(if type == "object" then del(.access, .refresh, .key) else . end) | .data.id // empty') \
  || fail "credential import API call failed"
[ -n "$NEW" ] || fail "credential import returned no id (see opencode server log)"

# --- 4. Verify it is registered and active ----------------------------------
opencode api get /api/credential 2>/dev/null \
  | jq -e --arg id "$NEW" --arg l "$LABEL" \
    '.data[]? | select(.id == $id and .integrationID == "openai" and .label == $l and .active == true)' \
  >/dev/null || fail "imported credential $NEW is not active after import"

echo "OK: imported $NEW, access token expires $(date -r "$EXP" '+%Y-%m-%d %H:%M %Z' 2>/dev/null || echo "at $EXP")"
