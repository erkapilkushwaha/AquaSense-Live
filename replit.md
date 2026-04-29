# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## AquaSense Live — Mobile App

**Location:** `artifacts/mobile/`  
**Kind:** Expo (React Native) — EAS Build ready for Android APK

### App Config (`app.json`)
- Package: `com.kapil.aquasense`
- Slug: `aquasense-live`
- `newArchEnabled: false` (required for react-native-usb-serialport-for-android)
- `minSdkVersion: 21`, `targetSdkVersion: 34`
- Custom config plugin (`app.plugin.js`) adds `android.hardware.usb.host` feature to AndroidManifest

### Key Files
| File | Purpose |
|------|---------|
| `app/(tabs)/index.tsx` | Dashboard — sensor cards, Connect Hardware button, student credits |
| `context/SensorDataContext.tsx` | Global state — sensors, alerts, USB status |
| `hooks/useUSBSerial.ts` | USB serial hook — 9600 baud, hex→ASCII, line-buffering, disconnect polling |
| `utils/dataParser.ts` | `parseRawSensorString("TDS|pH|TURB|TEMP|FLOW")` |
| `app.plugin.js` | Expo config plugin for USB host AndroidManifest entry |
| `eas.json` | EAS Build profiles (preview → APK, production → AAB) |

### EAS Build Commands (run locally after `eas login`)
```bash
eas build --platform android --profile preview     # → .apk for testing
eas build --platform android --profile production  # → .aab for Play Store
```

### Sensors (5 cards)
pH, TDS (PPM), Turbidity (NTU), Temperature (°C), Flow Rate (L/min)

### USB Serial Flow
Arduino sends `TDS|pH|TURB|TEMP|FLOW\n` at 9600 baud → hex stream buffered to ASCII lines → `parseRawSensorString` → all 5 sensor cards update in real-time. Mock polling pauses while hardware is connected.

### Credits (permanently on Dashboard)
Designed and Developed by **Aneesh Kumar** — Roll No 2205270100004, Computer Science Final Year, Sunrise Institute of Engineering Technology & Management.

### Critical Dependency Notes
- **Root `package.json` must NOT have any Expo/React Native dependencies.** The original scaffold left Expo 51 packages at the workspace root; these were hoisted by pnpm and caused Metro to resolve `expo-modules-core@1.12.26` (Expo 51) instead of `3.0.x` (Expo 54), breaking `expo-font@14.0.11`'s `registerWebModule` call. Root `package.json` now only contains workspace tooling dev deps.
- **No metro version overrides in `pnpm-workspace.yaml`.** `@expo/metro@54.2.0` uses metro 0.83.x private APIs; pinning metro to 0.80.8 breaks the bundler. The expo-doctor "metro version" warning is harmless — do not add metro overrides.
- **All expo packages use explicit exact/tilde versions** (no `catalog:` or `workspace:*`) in `artifacts/mobile/package.json` since EAS builds resolve packages differently from the local workspace.
