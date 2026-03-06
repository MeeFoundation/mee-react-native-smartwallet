# Apps Split Specification

## Goal

Convert the repository into a **pnpm monorepo** with three parts:

1. `apps/app-concepts` — the current app, **moved as-is** with zero code changes
2. `apps/app-production` — a new minimal Expo app, just a "New App" placeholder screen
3. `packages/core` — a shared package, initially containing only a proof-of-concept utility function

No code is migrated to `packages/core` yet. The goal is to prove the monorepo wiring works (both apps can import from `@mee/core`) before any real sharing happens.

---

## Monorepo Structure

```
mee-react-native-smartwallet/
├── apps/
│   ├── app-concepts/          # Current app moved here unchanged
│   └── app-production/        # New minimal app
│
├── packages/
│   └── core/                  # Shared package — proof-of-concept only for now
│
├── package.json               # Workspace root
├── pnpm-workspace.yaml
└── ... (all root config files stay: biome.json, commitlint, lefthook, tsconfig.json)
```

---

## Package: `packages/core`

A minimal package to prove code sharing works. No production code is moved here yet.

```
packages/core/
├── src/
│   └── index.ts               # Exports a single test utility function
├── package.json               # name: "@mee/core"
└── tsconfig.json
```

### Proof-of-concept export

```ts
// packages/core/src/index.ts
export function sharedGreeting(name: string): string {
  return `Hello from core, ${name}!`;
}
```

Both apps import this function to verify the monorepo resolution works:

```ts
import { sharedGreeting } from '@mee/core';
```

### Rules for `packages/core`

- No mock API data
- No Expo Router / screen-level routing
- No app-specific code
- Grows incrementally — code is moved here only when there is a concrete need to share it between both apps

---

## App: `apps/app-concepts`

The current app, **moved into `apps/app-concepts/` with no code changes**. All existing files, structure, screens, atoms, widgets, and native projects move together.

```
apps/app-concepts/
├── src/                   # Entire current src/ — unchanged
├── ios/                   # Current ios/ native project — moved here
├── android/               # Current android/ native project — moved here
├── assets/                # Icons, splash, fonts referenced in app.json — must move
├── @types/                # Global ambient type declarations — must move
├── vendor/                # CocoaPods vendor directory — must move
├── app.json
├── metro.config.js        # Updated: merges NativeWind + SVG transformer + monorepo resolution
├── babel.config.js
├── tsconfig.json          # Updated: adds @mee/core alias
├── tailwind.config.js     # Must move (NativeWind config)
├── steiger.config.mjs     # Must move (FSD architecture checker config)
├── react-native.config.js # Must move (SVG transformer config)
├── nativewind-env.d.ts    # Must move (NativeWind type declarations)
├── expo-env.d.ts          # Must move (Expo Router typed routes)
├── jest.config.js         # Must move
├── Gemfile                # Must move (CocoaPods Ruby dependency)
├── Gemfile.lock           # Must move
└── package.json           # name: "app-concepts", adds "@mee/core": "workspace:*"
```

The required changes to `app-concepts` after the move:

1. `package.json` — add `"@mee/core": "workspace:*"` to dependencies
2. `tsconfig.json` — add `"@mee/core/*"` path alias pointing to `packages/core/src`
3. `metro.config.js` — merge monorepo `watchFolders` / `nodeModulesPaths` with the existing NativeWind and SVG transformer setup (see Metro Config section below)

No import paths inside `src/` change at this stage.

---

## App: `apps/app-production`

A new, minimal Expo app. Contains a single screen showing "New App" text. Nothing else.

```
apps/app-production/
├── src/
│   └── app/
│       └── index.tsx          # Single screen: <Text>New App</Text>
├── app.json                   # name: "Mee Production", slug: "mee-production"
├── metro.config.js            # Same monorepo resolution config as app-concepts
├── babel.config.js
├── tsconfig.json
└── package.json               # name: "app-production", depends on "@mee/core": "workspace:*"
```

### `index.tsx`

```tsx
import { sharedGreeting } from '@mee/core';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>New App</Text>
      <Text>{sharedGreeting('world')}</Text>
    </View>
  );
}
```

The import of `sharedGreeting` serves as the proof that `@mee/core` resolution works.

---

## Workspace Root Changes

### `pnpm-workspace.yaml` (new file)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `package.json` (root)

```json
{
  "name": "mee-react-native-smartwallet",
  "private": true,
  "scripts": {
    "lint": "biome lint --error-on-warnings ./packages ./apps",
    "check-types": "tsc --build",
    "concepts:ios": "pnpm --filter app-concepts ios",
    "concepts:android": "pnpm --filter app-concepts android",
    "production:ios": "pnpm --filter app-production ios",
    "production:android": "pnpm --filter app-production android"
  }
}
```

### Root config files (unchanged, stay at root)

- `biome.json`
- `commitlint.config.js`
- `lefthook.yml`

### Root `tsconfig.json` (must change)

The current root `tsconfig.json` is the app's tsconfig (`extends: "expo/tsconfig.base"`). The `"check-types": "tsc --build"` script in root `package.json` requires TypeScript **project references** mode. The root `tsconfig.json` must be replaced with a references file:

```json
{
  "files": [],
  "references": [
    { "path": "packages/core" },
    { "path": "apps/app-concepts" },
    { "path": "apps/app-production" }
  ]
}
```

Each workspace's own `tsconfig.json` must include `"composite": true` for project references to work. Alternatively, skip project references and use per-workspace type checking:

```json
// root package.json — simpler alternative
"check-types": "pnpm -r --parallel exec tsc --noEmit"
```

**Decision required**: use `tsc --build` with project references, or `pnpm -r` parallel per-workspace check. The parallel approach is simpler and avoids composite build constraints.

---

## Metro Config: Monorepo Resolution

### `apps/app-concepts/metro.config.js`

The existing config has NativeWind (`withNativeWind`) and the SVG transformer. Monorepo resolution must be layered in without removing either. The merged config:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo resolution
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// SVG transformer (unchanged from original)
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...config.resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

const globalCssPath = path.resolve(projectRoot, 'src/shared/global.css');
module.exports = withNativeWind(config, {
  input: globalCssPath,
  inlineRem: 16,
});
```

### `apps/app-production/metro.config.js`

The production app is minimal — no NativeWind, no SVG transformer. Plain monorepo resolution only:

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
```

---

## Update README

The existing `README.md` must be updated to reflect the monorepo structure.

### Repo Overview (add at the top)

Add a short paragraph after the title explaining the monorepo:

> This repository is a **pnpm monorepo** containing two Expo apps and a shared core package.
>
> | Workspace | Purpose |
> |---|---|
> | `apps/app-concepts` | Full-featured concept/prototype app with mocked API |
> | `apps/app-production` | Production app — minimal, grows as real backend integrations are added |
> | `packages/core` | Shared utilities and components imported by both apps |

### Getting Started

Replace the current `pnpm ios` / `pnpm android` commands with per-app commands:

```sh
# Install all dependencies (run once from repo root)
pnpm install

# Run app-concepts
pnpm concepts:ios
pnpm concepts:android

# Run app-production
pnpm production:ios
pnpm production:android
```

### Dev Commands

Add a Dev Commands section covering all workspace-level scripts:

```sh
pnpm lint           # Biome lint across all packages and apps
pnpm check-types    # TypeScript type check across all workspaces
```

### What stays unchanged in README

- Localization section (i18next / ICU syntax)
- Translation Key Conventions
- Troubleshooting section (Android / iOS build problems)

---

## Open Decision

**`check-types` strategy** — choose one before implementing:

- **Option A** `tsc --build` (project references): requires `"composite": true` in each workspace tsconfig and a root `tsconfig.json` referencing all three workspaces. More setup, but enables incremental builds.
- **Option B** `pnpm -r exec tsc --noEmit` (parallel per-workspace): simpler, no composite constraints, each workspace checks itself independently.
^^^ Use this option 

Recommendation: **Option B** for the initial monorepo setup. Can migrate to project references later if build times become a concern.

---

## Implementation Checklist

- [ ] Decide `check-types` strategy (Option A or B above)
- [ ] Add `pnpm-workspace.yaml` at repo root
- [ ] Update root `package.json` scripts (including chosen `check-types` command)
- [ ] Update root `tsconfig.json` (project references if Option A; or leave as base if Option B)
- [ ] Create `packages/core/package.json`, `tsconfig.json`, and `src/index.ts` with `sharedGreeting`
- [ ] Move current app into `apps/app-concepts/` — full file list: `src/`, `ios/`, `android/`, `assets/`, `@types/`, `vendor/`, `app.json`, `metro.config.js`, `babel.config.js`, `tsconfig.json`, `tailwind.config.js`, `steiger.config.mjs`, `react-native.config.js`, `nativewind-env.d.ts`, `expo-env.d.ts`, `jest.config.js`, `Gemfile`, `Gemfile.lock`
- [ ] Update `apps/app-concepts/package.json` — add `@mee/core` dependency
- [ ] Update `apps/app-concepts/tsconfig.json` — add `@mee/core` alias
- [ ] Update `apps/app-concepts/metro.config.js` — merge monorepo resolution with NativeWind + SVG transformer (see Metro Config section)
- [ ] Create `apps/app-production/` with minimal screen, config files, and `@mee/core` dependency
- [ ] Run `pnpm install` at repo root (must be done manually — confirm before running)
- [ ] Verify `pnpm concepts:ios` builds and runs
- [ ] Verify `pnpm production:ios` builds and renders "New App" screen with `sharedGreeting` output
- [ ] Run `pnpm lint` and `pnpm check-types` — both pass
