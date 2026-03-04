---
name: expo-app-design
description: Build robust, productivity apps with Expo. Comprehensive guide covering UI components, navigation, styling, API routes, data fetching, development builds, Tailwind CSS, and web code integration.
version: 1.0.0
license: MIT
---

# Expo App Design

## Overview

Complete guide for building mobile applications with Expo and React Native. Covers everything from native UI components and navigation to server-side API routes and data fetching patterns.

## When to Use

Use this skill when:
- Building new Expo apps from scratch
- Implementing navigation, styling, or animations
- Setting up API routes or data fetching
- Creating development builds for testing
- Configuring Tailwind CSS for React Native
- Integrating web libraries via DOM components
- Using native UI frameworks (SwiftUI, Jetpack Compose)

## Skills Included

- **building-native-ui** — Complete guide for building beautiful apps with Expo Router. Covers fundamentals, styling, components, navigation, animations, patterns, and native tabs.

- **expo-api-route** — Guidelines for creating API routes in Expo Router with EAS Hosting. Use when you need server-side secrets, database operations, third-party API proxies, or webhook endpoints.

- **native-data-fetching** — Use for ANY network request, API call, or data fetching. Covers fetch API, React Query, SWR, error handling, caching, offline support, and Expo Router data loaders (useLoaderData).

- **expo-dev-client** — Build and distribute Expo development clients locally or via TestFlight. Use for creating custom Expo Go clients for testing branches of your app with custom native code.

- **expo-tailwind-setup** — Set up Tailwind CSS v4 in Expo with react-native-css and NativeWind v5 for universal styling across iOS, Android, and Web.

- **use-dom** — Use Expo DOM components to run web code in a webview on native and as-is on web. Migrate web code to native incrementally.

- **expo-ui-swift-ui** — Use SwiftUI Views and modifiers in your app via `@expo/ui/swift-ui` package (SDK 55).

- **expo-ui-jetpack-compose** — Use Jetpack Compose Views and modifiers in your app via `@expo/ui/jetpack-compose` package (SDK 55).

## References

Additional documentation for specific topics:

- `references/expo-router-loaders.md` — Route-level data loading with Expo Router loaders (web, SDK 55+)
- `references/animations.md` — Reanimated: entering, exiting, layout, scroll-driven, gestures
- `references/controls.md` — Native iOS: Switch, Slider, SegmentedControl, DateTimePicker, Picker
- `references/form-sheet.md` — Form sheets in expo-router: configuration, footers and background interaction
- `references/gradients.md` — CSS gradients via experimental_backgroundImage (New Arch only)
- `references/icons.md` — SF Symbols via expo-image (sf: source), names, animations, weights
- `references/media.md` — Camera, audio, video, and file saving
- `references/route-structure.md` — Route conventions, dynamic routes, groups, folder organization
- `references/search.md` — Search bar with headers, useSearch hook, filtering patterns
- `references/storage.md` — SQLite, AsyncStorage, SecureStore
- `references/tabs.md` — NativeTabs, migration from JS tabs, iOS 26 features
- `references/toolbar-and-headers.md` — Stack headers and toolbar buttons, menus, search (iOS only)
- `references/visual-effects.md` — Blur (expo-blur) and liquid glass (expo-glass-effect)
- `references/webgpu-three.md` — 3D graphics, games, GPU visualizations with WebGPU and Three.js
- `references/zoom-transitions.md` — Apple Zoom: fluid zoom transitions with Link.AppleZoom (iOS 18+)

## Quick Start

### Running the App

**CRITICAL: Always try Expo Go first before creating custom builds.**

Most Expo apps work in Expo Go without any custom native code. Before running `npx expo run:ios` or `npx expo run:android`:

1. Start with Expo Go: Run `npx expo start` and scan the QR code with Expo Go
2. Check if features work: Test your app thoroughly in Expo Go
3. Only create custom builds when required

### When Custom Builds Are Required

You need `npx expo run:ios/android` or `eas build` ONLY when using:
- Local Expo modules (custom native code in `modules/`)
- Apple targets (widgets, app clips, extensions via `@bacons/apple-targets`)
- Third-party native modules not included in Expo Go
- Custom native configuration that can't be expressed in `app.json`

## License

MIT
