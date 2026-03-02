---
description: Create GitHub pull request with target branch argument
agent: general
model: opencode/minimax-m2.5-free
subtask: false
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

Create a pull request for the current repository using GitHub CLI.

**Parse arguments:**
- `/gh/pr-create` → target: default branch
- `/gh/pr-create base:dev` → target: dev branch

**Execute:**
```bash
# Check prerequisites
gh --version || echo "Error: GitHub CLI not installed. Install with: brew install gh"
gh auth status || echo "Error: Not authenticated. Run: gh auth login --ssh"

# Parse arguments to extract target branch
TARGET_BRANCH="main"
args=$@()

# Parse "base:<branch>" pattern
for ((i=0; i<${#args[@]}; i++)); do
  if [[ "${args[$i]}" == base:* ]]; then
    TARGET_BRANCH="${args[$i]#base:}"
  fi
done

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Extract commits between source and target branches
COMMITS=$(git log --pretty=format:"%h|%s" origin/$TARGET_BRANCH..HEAD 2>/dev/null | head -50)

# Check if there are any commits
if [ -z "$COMMITS" ]; then
  echo "Error: No commits found between current branch and $TARGET_BRANCH"
  exit 1
fi

# Function to extract action verbs from commit messages
extract_actions() {
  local commits="$1"
  echo "$commits" | grep -oE "add|implement|fix|remove|update|improve|resolve|enhance|create|delete|modify|refactor|optimize|secure" | sort -u | tr '\n' ',' | sed 's/,$//'
}

# Function to extract key nouns from commit messages
extract_nouns() {
  local commits="$1"
  echo "$commits" | grep -oE "(cors|authentication|security|api|authentication|login|token|session|test|coverage|middleware|endpoint|feature|bug|issue|performance|database|cache|ui|interface|frontend|backend)" | sort -u | tr '\n' ',' | sed 's/,$//'
}

# Function to generate comprehensive summary title
generate_title() {
  local commits="$1"
  local actions=$(extract_actions "$commits")
  local nouns=$(extract_nouns "$commits")
  
  # Create title combining actions and nouns
  local title=""
  
  # Try multiple strategies for the best title
  if [ -n "$nouns" ]; then
    # Strategy 1: Focus on key features
    local noun_count=$(echo "$nouns" | tr ',' '\n' | wc -l)
    local key_nouns=$(echo "$nouns" | tr ',' '\n' | head -3 | tr '\n' ',' | sed 's/,$//')
    
    if [ -n "$actions" ]; then
      local first_action=$(echo "$actions" | cut -d',' -f1)
      title="${first_action} ${key_nouns}"
    else
      title="${key_nouns}"
    fi
  else
    # Fallback: Use commit messages
    local first_commit=$(echo "$commits" | head -1 | cut -d'|' -f2)
    title=$(echo "$first_commit" | sed 's/^[a-z]*://g' | sed 's/[^a-zA-Z0-9 ]//g' | awk '{for(i=1;i<=NF;i++) printf "%s ", toupper(substr($i,1,1)) substr($i,2)}' | sed 's/ $//')
  fi
  
  # Apply title case formatting
  title=$(echo "$title" | sed 's/ \(.\)/\U\1/g' | sed 's/^[a-z]/\U&/')
  
  # Remove duplicate words
  title=$(echo "$title" | tr ' ' '\n' | awk '!seen[$0]++' | tr '\n' ' ' | sed 's/ $//')
  
  # Trim to 80-100 characters (prefer shorter)
  local len=${#title}
  if [ $len -gt 100 ]; then
    title=$(echo "$title" | cut -c1-100)
  fi
  if [ $len -lt 80 ]; then
    # Try to add more context from branch name
    local branch_context=$(echo "$CURRENT_BRANCH" | sed 's/^[a-z]*\///' | sed 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++) printf "%s ", toupper(substr($i,1,1)) substr($i,2)}' | sed 's/ $//')
    if [ ${#branch_context} -gt 0 ]; then
      local combined="${title} ${branch_context}"
      if [ ${#combined} -le 100 ]; then
        title="$combined"
      fi
    fi
  fi
  
  echo "$title"
}

# Function to generate PR body
generate_body() {
  local commits="$1"
  local target_branch="$2"
  
  local body=""
  
  # Extract file changes
  local changed_files=$(git diff --name-status origin/$target_branch..HEAD 2>/dev/null | head -20)
  local changed_files_list=$(git diff --name-only origin/$target_branch..HEAD 2>/dev/null)
  
  # Detect test files
  local test_files=$(echo "$changed_files_list" | grep -iE "(spec|test|e2e|integration)" 2>/dev/null)
  local test_count=$(echo "$test_files" | wc -l | tr -d ' ')
  
  # Detect UI files
  local ui_files=$(echo "$changed_files_list" | grep -iE "\.(css|jsx|tsx|vue|html|scss|sass)" 2>/dev/null)
  local ui_count=$(echo "$ui_files" | wc -l | tr -d ' ')
  
  # Detect risky files
  local risky_files=$(echo "$changed_files_list" | grep -iE "(package\.json|tsconfig\.json|\.env|routes|controllers|models|middleware)" 2>/dev/null)
  local risky_count=$(echo "$risky_files" | wc -l | tr -d ' ')
  
  # Summary Section
  body="${body}## Summary\n\n"
  
  # Count commit types
  local feat_count=$(echo "$commits" | grep -c "^.*|feat:" 2>/dev/null || echo 0)
  local fix_count=$(echo "$commits" | grep -c "^.*|fix:" 2>/dev/null || echo 0)
  local docs_count=$(echo "$commits" | grep -c "^.*|docs:" 2>/dev/null || echo 0)
  local refactor_count=$(echo "$commits" | grep -c "^.*|refactor:" 2>/dev/null || echo 0)
  
  if [ "$feat_count" -gt 0 ]; then
    body="${body}This PR includes ${feat_count} feature(s)."
  fi
  if [ "$fix_count" -gt 0 ]; then
    body="${body} Fixes ${fix_count} issue(s)."
  fi
  if [ "$docs_count" -gt 0 ]; then
    body="${body} Updates documentation in ${docs_count} location(s)."
  fi
  if [ "$refactor_count" -gt 0 ]; then
    body="${body} Refactors ${refactor_count} component(s)."
  fi
  
  body="${body}\n\n"
  
  # Context Section
  body="${body}## Context\n\n"
  body="${body}### Why These Changes?\n\n"
  
  # Group commits by type
  if [ "$feat_count" -gt 0 ]; then
    body="${body}**Features:**\n"
    echo "$commits" | grep "|feat:" | cut -d'|' -f2 | sed 's/^feat: /- /' >> /tmp/commits_temp.txt
    while IFS= read -r line; do
      body="${body}${line}\n"
    done < /tmp/commits_temp.txt
    body="${body}\n"
  fi
  
  if [ "$fix_count" -gt 0 ]; then
    body="${body}**Bug Fixes:**\n"
    echo "$commits" | grep "|fix:" | cut -d'|' -f2 | sed 's/^fix: /- /' >> /tmp/commits_temp2.txt
    while IFS= read -r line; do
      body="${body}${line}\n"
    done < /tmp/commits_temp2.txt
    body="${body}\n"
  fi
  
  if [ "$docs_count" -gt 0 ]; then
    body="${body}**Documentation:**\n"
    echo "$commits" | grep "|docs:" | cut -d'|' -f2 | sed 's/^docs: /- /' >> /tmp/commits_temp3.txt
    while IFS= read -r line; do
      body="${body}${line}\n"
    done < /tmp/commits_temp3.txt
    body="${body}\n"
  fi
  
  # Changes Section
  body="${body}## Changes\n\n"
  if [ -n "$changed_files" ]; then
    echo "$changed_files" > /tmp/changes_temp.txt
    while IFS= read -r line; do
      local status=$(echo "$line" | awk '{print $1}')
      local file=$(echo "$line" | awk '{print $2}')
      local status_text=""
      case "$status" in
        "M") status_text="Modified:" ;;
        "A") status_text="Added:" ;;
        "D") status_text="Deleted:" ;;
        "R") status_text="Renamed:" ;;
        *) status_text="Changed:" ;;
      esac
      body="${body}- ${status_text} \`${file}\`\n"
    done < /tmp/changes_temp.txt
  else
    body="${body}- No file changes detected\n"
  fi
  body="${body}\n"
  
  # Testing Section
  body="${body}## Testing\n\n"
  if [ "$test_count" -gt 0 ]; then
    body="${body}Test files modified (${test_count}):\n"
    echo "$test_files" > /tmp/test_files_temp.txt
    while IFS= read -r file; do
      body="${body}- \`${file}\`\n"
    done < /tmp/test_files_temp.txt
    body="${body}\n"
    body="${body}All tests should pass with these changes.\n"
  else
    body="${body}No test files modified in this PR. Manual testing recommended.\n"
  fi
  body="${body}\n"
  
  # Risk/Impact Section
  body="${body}## Risk/Impact\n\n"
  if [ "$risky_count" -gt 0 ]; then
    body="${body}**Potential Impact:**\n"
    body="${body}- ${risky_count} core or configuration file(s) modified\n"
    body="${body}- Changes may affect application stability\n"
    body="${body}- Thorough testing recommended before merging\n"
    
    if [ -n "$risky_files" ]; then
      body="${body}\nRisky files:\n"
      echo "$risky_files" > /tmp/risky_files_temp.txt
      while IFS= read -r file; do
        body="${body}- \`${file}\`\n"
      done < /tmp/risky_files_temp.txt
    fi
  else
    body="${body}**Low Risk Changes:**\n"
    body="${body}- No core or configuration files modified\n"
    body="${body}- Safe to merge after review\n"
  fi
  body="${body}\n"
  
  # Visuals Section
  body="${body}## Visuals\n\n"
  if [ "$ui_count" -gt 0 ]; then
    body="${body}UI components modified (${ui_count}):\n"
    echo "$ui_files" > /tmp/ui_files_temp.txt
    while IFS= read -r file; do
      body="${body}- \`${file}\`\n"
    done < /tmp/ui_files_temp.txt
    body="${body}\n<!-- Add screenshots or GIFs here to demonstrate UI changes -->\n"
  else
    body="${body}No UI changes in this PR.\n"
  fi
  
  # Cleanup temp files
  rm -f /tmp/commits_temp*.txt 2>/dev/null
  rm -f /tmp/changes_temp.txt 2>/dev/null
  rm -f /tmp/test_files_temp.txt 2>/dev/null
  rm -f /tmp/risky_files_temp.txt 2>/dev/null
  rm -f /tmp/ui_files_temp.txt 2>/dev/null
  
  echo "$body"
}

# Generate PR body first
PR_BODY=$(generate_body "$COMMITS" "$TARGET_BRANCH")

# Generate title from body
PR_TITLE=$(generate_title "$COMMITS")

# Create PR
gh pr create --source "$CURRENT_BRANCH" --base "$TARGET_BRANCH" --title "$PR_TITLE" --body "$PR_BODY"
```

**Error handling:**
- Missing target branch → use default branch
- Authentication failure → prompt user to authenticate
- Invalid branch → suggest running `/gh/get-branches`
- No changes to commit → ask user to stage changes first
