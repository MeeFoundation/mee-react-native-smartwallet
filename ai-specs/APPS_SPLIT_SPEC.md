# Apps Split Specification

## Goal

Split the current single-app repository into a **pnpm monorepo** containing two Expo applications that share a common core package.

| App | Purpose |
|---|---|
| `apps/app-concepts` | Concept/prototype app — full feature set, mocked API, rapid iteration |
| `apps/app-production` | Production app — real backend integration, starts with Welcome screens only |

Both apps import all shared logic and UI from `packages/core`.

---

## Monorepo Structure

```
mee-react-native-smartwallet/
├── apps/
│   ├── app-concepts/          # Current app, all screens, mocked API
│   └── app-production/        # Production app, Welcome screens only initially
│
├── packages/
│   └── core/                  # All shared code: entities, features, widgets, shared utilities
│
├── assets/                    # Shared branding assets (icons, splash, fonts, images) — used by both apps
├── @types/                    # Global TypeScript type declarations — shared across all workspaces
├── vendor/                    # Vendored code — stays at workspace root
├── package.json               # Workspace root (pnpm workspaces)
├── pnpm-workspace.yaml        # Declares apps/* and packages/*
├── README.md                  # Updated (see README section below)
└── ... (root config files stay at root: biome.json, commitlint, lefthook, tsconfig.json)
```

---

## Package: `packages/core`

The single shared package. All code that is not app-routing or mock data lives here.

### Internal structure mirrors current FSD layout:

```
packages/core/
├── src/
│   ├── shared/          ← moved from src/shared/ (unchanged)
│   ├── entities/        ← moved from src/entities/ — EXCEPT api/mock/ subdirectories and API-calling atoms
│   ├── features/        ← moved from src/features/ (auth, localization, upload — unchanged)
│   └── widgets/         ← moved from src/widgets/ — EXCEPT widgets/drawer/ and widgets/chat/ (both app-concepts only)
│
├── package.json         # name: "@mee/core", no Expo entry point
└── tsconfig.json        # Exports path aliases: @core/shared, @core/entities, @core/features, @core/widgets
```

### What goes in `packages/core/widgets/`

All widgets **except** those that are deeply coupled to mock API atoms:

| Widget | In core? | Notes |
|---|---|---|
| `welcome` | ✅ Yes | Pure UI, includes `welcomeSlides` content (same for both apps) |
| `navigation` | ✅ Yes | Generic layout primitives |
| `group-my-info` | ✅ Yes | Receives data via props |
| `group-screen-header` | ✅ Yes | Receives data via props |
| `chat` | ❌ No — stays in `app-concepts` | Tightly coupled to mock atoms; to be refactored to props-based and moved to core in a future iteration |
| `drawer` | ❌ No — stays in `app-concepts` | App-concepts-specific debug menu |

### Rules for `packages/core`

- **No mock API data** — no `api/mock/` directories, no hardcoded fake responses
- **No Expo Router** — no `src/app/` or screen-level routing
- **No app-specific navigation** — no drawer or chat widget (both app-concepts only for now)
- **No API-calling atoms** — entity model directories contain only non-API atoms (UI state, filters, derived state)
- Entities export API **interface/contract** (TypeScript types + function signatures) but no implementation
- **Core components/widgets are props-driven** — they receive data and callbacks as props; they do not call `useAtom` on API-dependent atoms directly
- All existing public `index.ts` boundaries are preserved as-is
- `@x/` cross-import files are preserved **except** `connection/@x/profile` and `connection/@x/tag` — these are deleted because `ProfileStore` and `TagsStore` move to app-level and no longer live in core
- `widgets/welcome` includes the `welcomeSlides` content — onboarding copy is identical across both apps

---

## Data Flow Pattern

Chosen approach: **props-driven core components, app-level atoms**.

### Rule

Core widgets and components **receive data and callbacks as props**. They do not own API-calling atoms. App-level screens create or use atoms that fetch data, then pass the result down as props to core components.

Non-API atoms (UI toggles, filters, auth state, localization, etc.) remain in `packages/core` entities/features as before — these don't need to move.

### Example

```ts
// packages/core/src/widgets/group-my-info/PersonalDetails.tsx
// Pure component — no useAtom for API data
type Props = {
  details: PersonalDetails
  onSave: (updated: PersonalDetails) => void
}
export function PersonalDetails({ details, onSave }: Props) { ... }

// apps/app-concepts/src/app/groups/[id]/my-info/personal-details.tsx
// Screen owns the atom, passes data down
import { getMyGroupPersonalDetailsAtom } from '../../atoms/group'
import { PersonalDetails } from '@core/widgets/group-my-info'

export default function PersonalDetailsScreen() {
  const [details] = useAtom(getMyGroupPersonalDetailsAtom(groupId))
  return <PersonalDetails details={details} onSave={...} />
}

// apps/app-concepts/src/atoms/group.ts
// Action atom — imports mock API
import { getMyGroupPersonalDetails } from '../api/group'
export const getMyGroupPersonalDetailsAtom = atomFamily((groupId: string) =>
  atomWithDefault(() => getMyGroupPersonalDetails(groupId))
)
```

### What stays in `packages/core` entity model directories

Only atoms that do **not** require an API call:

| Entity | Stays in core |
|---|---|
| `chat` | Typing indicator atom, join/leave event atom, UI-only state |
| `connection` | Filter atoms, sort atoms |
| `group` | Filter atoms, active-tab atom |
| `contact` | UI state atoms |
| `auth` | `isAuthenticatedAtom`, `isFirstTimeAuthAtom` (MMKV, no API) |
| `profile` | Moves to app-level (derived from API-dependent `ConnectionsStore`) |
| `tag` | Moves to app-level (derived from API-dependent `ConnectionsStore`) |

### Chat widget — deferred

`widgets/chat` stays in `apps/app-concepts` for now. It is deeply coupled to mock API atoms and requires a props-based refactor before it can move to core. This is tracked as future work.

When the chat widget is eventually migrated to core, it will follow the same props pattern: the `Chat` component will accept `messages`, `onSend`, `onLoadMore`, `typingUsers`, etc. as props, and the screen will wire these from atoms.

---

## App: `apps/app-concepts`

**Purpose:** Full working prototype for design and feature exploration. The current app, refactored to import shared code from `@mee/core`.

```
apps/app-concepts/
├── src/
│   ├── app/             ← all current Expo Router screens and layouts (unchanged)
│   ├── api/             ← all mock API implementations moved here from entities/*/api/mock/
│   │   ├── chat/
│   │   ├── connection/
│   │   ├── contact/
│   │   └── group/
│   ├── atoms/           ← API-calling atoms: fetch mock data, pass results to screens as props
│   │   ├── chat.ts
│   │   ├── connection.ts
│   │   ├── contact.ts
│   │   ├── group.ts
│   │   ├── profile.ts   ← derived from ConnectionsStore (moved from core)
│   │   └── tag.ts       ← derived from ConnectionsStore (moved from core)
│   └── widgets/
│       ├── chat/        ← moved from src/widgets/chat/ (stays here until props-based refactor)
│       └── drawer/      ← moved from src/widgets/drawer/ (app-concepts only forever)
│
├── app.json             # name: "Mee Concepts", slug: "mee-concepts", bundle: com.mee.concepts
├── metro.config.js      # Same config, resolves @mee/core from packages/core
├── babel.config.js
├── tsconfig.json        # Extends root tsconfig, adds @core/* aliases pointing to packages/core/src
└── package.json         # name: "app-concepts", depends on "@mee/core": "workspace:*"
```

### What app-concepts keeps from current codebase

| Current path | New path |
|---|---|
| `src/app/` | `apps/app-concepts/src/app/` |
| `src/entities/*/api/mock/` | `apps/app-concepts/src/api/*/` |
| `src/widgets/chat/` | `apps/app-concepts/src/widgets/chat/` |
| `src/widgets/drawer/` | `apps/app-concepts/src/widgets/drawer/` |
| _(new)_ | `apps/app-concepts/src/atoms/` — API-calling atoms (extracted from entity stores + profile/tag derived atoms) |

All other `src/` content moves to `packages/core`.

### Path alias changes in app-concepts

| Old alias | New alias | Resolves to |
|---|---|---|
| `@/shared/*` | `@core/shared/*` | `packages/core/src/shared/*` |
| `@/entities/*` | `@core/entities/*` | `packages/core/src/entities/*` |
| `@/features/*` | `@core/features/*` | `packages/core/src/features/*` |
| `@/widgets/*` (chat, drawer) | `@/widgets/*` | `apps/app-concepts/src/widgets/*` (stays local) |
| `@/widgets/*` (all others) | `@core/widgets/*` | `packages/core/src/widgets/*` |
| `@/app/*` | `@/app/*` | `apps/app-concepts/src/app/*` (stays local) |

> In practice: `@core/widgets/*` is used for welcome, navigation, group-my-info, group-screen-header. `@/widgets/*` is used for chat and drawer (local only). Both aliases coexist in `tsconfig.json`.

---

## App: `apps/app-production`

**Purpose:** Production-ready app that will connect to real backends. Starts minimal and grows as real API integrations are completed.

```
apps/app-production/
├── src/
│   ├── app/
│   │   ├── _layout.tsx        # Simplified root layout (auth guard, fonts, no dev drawer)
│   │   ├── sign-in.tsx        # Copied from app-concepts initially; diverges as real auth is wired up
│   │   ├── welcome.tsx        # Copied from app-concepts; uses same @core/widgets/welcome
│   │   └── (tabs)/
│   │       └── index.tsx      # Redirects to /welcome until more screens are ready
│   ├── atoms/                 # Action atoms — will call real API clients (empty at start)
│   └── api/                   # Real API clients (empty at start, grows over time)
│
├── app.json             # name: "Mee", slug: "mee-production", bundle: com.mee.app
├── metro.config.js
├── babel.config.js
├── tsconfig.json        # Same alias setup as app-concepts
└── package.json         # name: "app-production", depends on "@mee/core": "workspace:*"
```

### Constraints for app-production

- **No mock data, no mock API** — only real API calls or graceful "coming soon" states
- New screens are added here only when a real backend endpoint is available
- The `widgets/drawer` debug menu is **never added** to this app
- Feature flags or environment checks must not be used to toggle mock vs real — the two apps are the toggle

### Screens available at launch

| Screen | Source |
|---|---|
| Sign-in (biometrics) | Per-app screen, copied from app-concepts at migration time; uses `@core/features/auth` atoms |
| Welcome / Onboarding | Per-app screen, copied from app-concepts; uses `@core/widgets/welcome` (same slides content) |

All other screens (groups, chat, people, wallet, manage-connection, etc.) are **not present** in app-production until real API integration is built.

---

## Workspace Root Changes

### `package.json` (root)

```json
{
  "name": "mee-react-native-smartwallet",
  "private": true,
  "scripts": {
    "lint": "biome lint --error-on-warnings ./packages ./apps",
    "check-types": "tsc --build",
    "steiger:core": "steiger ./packages/core/src",
    "steiger:concepts": "steiger ./apps/app-concepts/src",
    "concepts:ios": "pnpm --filter app-concepts ios",
    "concepts:android": "pnpm --filter app-concepts android",
    "production:ios": "pnpm --filter app-production ios",
    "production:android": "pnpm --filter app-production android"
  }
}
```

### `pnpm-workspace.yaml` (new file)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Root config files (stay at root, apply workspace-wide)

- `biome.json` — linter/formatter
- `commitlint.config.js` — conventional commits
- `lefthook.yml` — git hooks
- `tsconfig.json` — base config extended by each app/package
- `assets/` — shared branding assets referenced by both apps via relative path in `app.json`
- `@types/` — global TypeScript declarations available to all workspaces
- `vendor/` — vendored code shared across workspaces

---

## Metro Config: Resolving Monorepo Packages

Each app's `metro.config.js` must be updated to resolve `packages/core` as a watched folder and to handle symlinks from pnpm. This requires the `watchFolders` and `resolver.nodeModulesPaths` Metro options pointing to the monorepo root `node_modules` and `packages/core`.

No custom bundler or build tool is needed — pnpm `workspace:*` protocol + Metro symlink resolution is sufficient.

---

## Native Projects (iOS / Android)

- Each app gets its own `ios/` and `android/` native project directories (generated by `expo prebuild`)
- Currently the `ios/` and `android/` directories at the repo root belong to the current single app — they become the native projects for `apps/app-concepts` (moved in, not regenerated)
- `apps/app-production` generates fresh native projects via `expo prebuild` with its own bundle identifiers

---

## FSD Architecture Linter (`steiger`)

- `steiger.config.mjs` is duplicated into each app and into `packages/core`
- The core package enforces FSD rules on `shared/`, `entities/`, `features/`, `widgets/`
- Each app enforces FSD rules on its own `src/` (primarily the `app/` routing layer)
- Cross-package imports (app importing from `@core/*`) are allowed by steiger config since they cross package boundaries, not FSD layer boundaries

---

## README Update Plan

The existing `README.md` will be updated to cover:

1. **Repo Overview section** — explain the monorepo, two apps, and the `packages/core` shared package; clarify that `app-concepts` is the prototype and `app-production` is the real product
2. **Getting Started** — update `pnpm install` (same), add separate run commands per app (`pnpm concepts:ios`, `pnpm production:ios`, etc.)
3. **Architecture section** — describe the FSD layers and which layer lives where (core package vs app); include a simple diagram of the dependency graph (`app-concepts → @mee/core`, `app-production → @mee/core`)
4. **Adding a new feature** — short guide: implement shared logic in `packages/core`, wire up screens in the relevant app(s); mock in app-concepts first, real API in app-production when backend is ready
5. **Mock API** — note that all mock data lives only in `apps/app-concepts/src/api/` and must never be added to `packages/core` or `apps/app-production`
6. Existing sections (Localization, Troubleshooting, ICU syntax) remain unchanged

---

## Migration Checklist (for implementation)

- [ ] Add `pnpm-workspace.yaml` at repo root
- [ ] Create `packages/core/` directory and `package.json`
- [ ] Move `src/shared/`, `src/entities/` (minus mock, minus API-calling atoms), `src/features/`, `src/widgets/` (minus chat and drawer) into `packages/core/src/`
- [ ] Delete `packages/core/src/entities/connection/@x/profile` and `@x/tag` (dead cross-imports after profile/tag move to app-level)
- [ ] Create `apps/app-concepts/` and move current `src/app/`, mock API files, `widgets/chat/`, `widgets/drawer/` into it
- [ ] Extract API-calling atoms from entity stores into `apps/app-concepts/src/atoms/` (including `ProfileStore` and `TagsStore` which are derived from API-dependent atoms)
- [ ] Refactor core widgets that currently use API-dependent atoms to receive data via props instead (non-chat widgets only)
- [ ] Update all `@/` path aliases in app-concepts to `@core/` where applicable
- [ ] Create `apps/app-production/` with minimal screen set; copy sign-in + welcome screens from app-concepts
- [ ] Create empty `apps/app-production/src/atoms/` and `apps/app-production/src/api/` directories
- [ ] Update `metro.config.js` in each app for monorepo resolution
- [ ] Move `ios/` and `android/` native projects into `apps/app-concepts/`
- [ ] Run `expo prebuild` in `apps/app-production/` to generate fresh native projects
- [ ] Update `app.json` in each app (names, slugs, bundle IDs)
- [ ] Update root `package.json` scripts
- [ ] Duplicate and adjust `steiger.config.mjs` per package/app
- [ ] Update `tsconfig.json` (root base + per-package extends)
- [ ] Update `README.md` as described above
- [ ] Verify `biome lint` and `tsc --noEmit` pass across all workspaces
- [ ] Verify both apps build on iOS and Android