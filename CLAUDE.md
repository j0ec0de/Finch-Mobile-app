# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

The mobile app for **Finch**, a personal finance tracker. It is an Expo / React Native client for
the existing Finch API. There is no backend in this repo.

- **Backend:** `finance-app/backend`, at `/home/joelanto/Projects/finance-app/backend`. Express 5,
  Postgres and Drizzle, with JWT auth. Its own `CLAUDE.md` describes it.
- **Web app (reference implementation):** `finance-app/frontend`, a Vite + React SPA. Every
  feature in this app already exists there. When porting a screen, read the web version first and
  match its behaviour.

Two other files in this repo apply and must be read before working on the app:

- `AGENTS.md`: development rules (stack, architecture, UX and code-quality expectations).
- `DESIGN.md`: the design system (tokens, typography, spacing, component specs, charts).

**Status:** the repo is still the stock Expo template. The build phases below track what to build
next. Keep the "Current state" line at the bottom of this file up to date as phases land.

---

## Commands

- `npx expo start`: start the Metro dev server. Builds use `expo-dev-client`, so run them in a dev
  build, not Expo Go, once native modules are added.
- `npm run ios` / `npm run android`: start the dev server and open a simulator or emulator.
- `npm run lint`: ESLint through `expo lint` (`eslint.config.js`, `eslint-config-expo`).
- `npm run typecheck`: `tsc --noEmit`. **Phase 0 adds this script.**
- `npm test`: Jest via `jest-expo` with `@testing-library/react-native`. **Phase 0 adds this.**
- EAS (`eas.json`) build profiles:
  - `development`: dev client, internal distribution.
  - `preview`: internal distribution.
  - `production`: auto-incremented builds; the app version comes from EAS remotely.

### Environment

`EXPO_PUBLIC_API_URL` is the backend base URL *including* the `/api` prefix, the same value as the
web's `VITE_API_URL`. Put it in `.env` (git-ignored) and document it in `.env.example`.

- **Physical device:** `localhost` points at the phone itself. Use your machine's LAN IP, e.g.
  `http://192.168.1.10:3000/api`.
- **Android emulator:** use `http://10.0.2.2:3000/api`.
- **iOS simulator:** `http://localhost:3000/api` works.

`EXPO_PUBLIC_*` values are inlined into the JS bundle, so they must never hold secrets.

`@/*` resolves to the repo root (`tsconfig.json`), matching the Expo template. There is no `src/`.

## Stack

Versions in `package.json` are authoritative.

| Concern | Choice |
|---|---|
| Runtime | Expo SDK 58, React Native 0.88, React 19.3, React Compiler on (`app.json` experiments) |
| Routing | expo-router with typed routes (`experiments.typedRoutes`) |
| Styling | NativeWind v5 (Tailwind CSS v4), with tokens in `global.css` (see `DESIGN.md`) |
| Server state | `@tanstack/react-query` v5 |
| Forms | `react-hook-form` + `zod` v4 (`@hookform/resolvers`) |
| Token storage | `expo-secure-store` |
| Lists | `@shopify/flash-list` |
| Charts | `victory-native` (Skia, needs `@shopify/react-native-skia`) |
| Icons | `lucide-react-native` + `react-native-svg`, the same icon set as the web |
| Toasts | `sonner-native`, the same API as the web's `sonner` |
| Font | Geist, loaded with `expo-font` |
| Feedback | `expo-haptics` |
| Network status | `@react-native-community/netinfo` |

## Architecture

### Folder layout

```
app/                         expo-router routes ONLY: thin files that render a feature screen
  _layout.tsx                providers + root Stack with Stack.Protected guards
  (auth)/
    _layout.tsx
    sign-in.tsx
    sign-up.tsx
  (app)/
    _layout.tsx              Stack: the tab group plus pushed screens and form sheets
    (tabs)/
      _layout.tsx            bottom tabs
      index.tsx              Home (dashboard)
      transactions.tsx
      plan.tsx               Budgets + Goals
      insights.tsx           Analytics
      more.tsx
    transactions/new.tsx     formSheet
    transactions/[id].tsx    formSheet (edit / delete)
    transfer.tsx             formSheet
    accounts/index.tsx, new.tsx, [id].tsx
    categories/index.tsx, new.tsx, [id].tsx
    budgets/new.tsx, [id].tsx
    goals/new.tsx, [id].tsx
    settings.tsx
features/<area>/             screen components, sub-components and form hooks for one feature
                             (auth, dashboard, transactions, accounts, categories, budgets,
                             goals, insights, settings)
components/ui/               shared NativeWind primitives (Button, Card, Input, Badge, ListRow,
                             StatTile, Meter, EmptyState, Skeleton, ...): see DESIGN.md
components/                  app-level shared components (BrandMark, ScreenError, ...)
lib/                         framework-agnostic TS: API client, resource modules, format,
                             date helpers, pure calculations, zod schemas (lib/schemas/)
hooks/                       use-auth.tsx, use-<resource>.ts React Query hooks, use-display-currency.ts
constants/theme.ts           JS mirror of the tokens, for places classes can't reach
                             (charts, the react-navigation theme, StatusBar)
global.css                   NativeWind tokens, light + dark
```

**Route files stay thin.** A file under `app/` sets screen options and renders a component from
`features/<area>/`. It holds no data fetching, forms or layout logic. A multi-part screen gets its
own folder, as the web does (e.g. `features/dashboard/` holds each dashboard card).

### Providers

`app/_layout.tsx`, outermost first:

1. `GestureHandlerRootView`
2. `SafeAreaProvider`
3. `QueryClientProvider`
4. `AuthProvider`
5. react-navigation `ThemeProvider`, with a theme built from `constants/theme.ts` for the current
   colour scheme
6. the root `Stack`, plus `<Toaster />` from sonner-native

`global.css` is imported once here. Fonts load here too, and the splash screen stays up
(`SplashScreen.preventAutoHideAsync`) until **both** the fonts and the auth session have loaded.

### Routing and auth

The web's `ProtectedRoute` becomes expo-router's protected groups:

```tsx
<Stack>
  <Stack.Protected guard={!token}>
    <Stack.Screen name="(auth)" />
  </Stack.Protected>
  <Stack.Protected guard={!!token}>
    <Stack.Screen name="(app)" />
  </Stack.Protected>
</Stack>
```

`AuthProvider` (`hooks/use-auth.tsx`) is ported from `frontend/src/hooks/use-auth.tsx`. It exposes
the same `{ user, token, isLoading, login, register, logout }` context. Differences from the web:

- The JWT lives in `expo-secure-store` under the key `finch.token`, never in AsyncStorage. Reading
  it is async, so `isLoading` starts `true` and the splash screen covers it.
- On load (and whenever the token changes) it calls `GET /auth/me` to rehydrate the user. If that
  fails, it clears the token, the same as the web.
- **A 401 from any request** clears the token. The `Stack.Protected` guard then sends the user to
  sign-in.
  - Tokens expire after `JWT_EXPIRES_IN` (default 1 day). There is no refresh endpoint yet; see
    backend dependencies.
- `logout` clears the token locally and calls `queryClient.clear()` so the next user never sees
  cached data.

Read auth through `useAuth`. Never touch SecureStore directly outside `use-auth.tsx`.

### API layer (`lib/`)

Port these files from `finance-app/frontend/src/lib/`. **Change as little as possible**, so the two
clients stay easy to diff:

| Web file | Notes |
|---|---|
| `api.ts` | `apiRequest<T>` and `ApiError`. Only change is reading `process.env.EXPO_PUBLIC_API_URL` instead of `import.meta.env.VITE_API_URL`. |
| `auth.ts`, `accounts.ts`, `categories.ts`, `transactions.ts`, `transfers.ts`, `budgets.ts`, `goals.ts` | Typed resource clients, entity types, enum arrays (`accountTypes`, `currencies`, `budgetPeriods`, `transactionTypes`), `buildQuery`. Copy as-is. |
| `format.ts` | `formatCurrency` (`Intl.NumberFormat`) and `calcDeltaPct`. Check currency output on Android Hermes. |
| `date-range.ts` | `getMonthRange`, `getLastNDaysRange`, `getLastNMonthsRange`, `getMonthLabel`. Copy as-is. |

Rules:

- **No `fetch` in components or hooks.** Add a function to `lib/<resource>.ts` and call that.
- **Money is a string.** The API returns `numeric(12,2)` columns (`balance`, `amount`, `limit`,
  `targetAmount`, `savedAmount`) as strings. Summary endpoints return numbers.
  - Parse to a number only for display and charts.
  - Form values stay strings until zod coerces them on submit.
- Errors come back as `{ error }`. Validation failures are a 400 with
  `{ error: 'Validation failed', details }`. `ApiError` carries `status` and `message`; show
  `message` inline.

Extract pure logic currently embedded in web components into `lib/` and unit-test it:

- `buildDailyFlow` from `frontend/src/pages/dashboard/balance-overview-card.tsx`.
- The savings-rate math from `frontend/src/pages/dashboard/financial-health-card.tsx`.

### Server state (`hooks/`)

Port `frontend/src/hooks/use-{accounts,transactions,categories,budgets,goals,transfers}.ts` with
the **same query keys and invalidation rules**:

- Transaction and transfer mutations also invalidate `["accounts"]`, because balances are cached on
  the server.
- Swap `sonner` for `sonner-native`; the `toast.success(...)` calls stay the same.

Port `use-display-currency.ts` unchanged. It picks the currency most accounts use; there is no
conversion (backend item #12).

Mobile-specific setup, done once next to the `QueryClient`:

- `focusManager` driven by `AppState` (refetch when the app returns to the foreground).
- `onlineManager` driven by NetInfo.
- The transactions screen uses `useInfiniteQuery` over the API's `limit`/`offset` pagination
  (`{ data, total, limit, offset }`). Page size is 30.

### Forms

The web's hand-rolled `use-create-*-form` / `use-edit-*-form` hooks are tied to DOM events, so they
are **rewritten, not ported**:

- `react-hook-form` + `zodResolver`.
- One form hook per form in `features/<area>/`, e.g. `features/transactions/use-transaction-form.ts`.
  The hook owns the field state, submit handler, server error and `isSubmitting`; the screen only
  renders.
- Zod schemas live in `lib/schemas/` and mirror `finance-app/backend/src/modules/*/*.schema.ts`.
  - The same limits apply: password ≥ 8, 3-letter currency, enum values.
  - Keep the backend's split: edit forms send only changed fields, so the PATCH body must never
    carry defaults.

### Mutation UX

- **Create and edit are form-sheet routes** (`presentation: 'formSheet'`) under `app/(app)/...`,
  pushed with `router.push('/transactions/new')` and dismissed with `router.back()` on success.
  - The web used dialogs.
  - Sheets are deep-linkable and get native gestures.
- **Delete always asks first** with a native `Alert.alert` using a `destructive` button. The web
  deletes immediately; mobile deliberately doesn't.
- Transfer legs can't be edited (the API returns 409), so their edit sheet shows read-only details
  and a delete action. Deleting one leg deletes both.

### Navigation map

Bottom tabs:

| Tab | Route | Contents | Web source |
|---|---|---|---|
| Home | `(tabs)/index` | Dashboard cards, stacked in one column | `pages/dashboard-page.tsx`, `pages/dashboard/*` |
| Transactions | `(tabs)/transactions` | Infinite list, filters for account and type, transfer badge | `pages/transactions-page.tsx` |
| Plan | `(tabs)/plan` | Segmented control: Budgets / Goals, each with progress meters | `pages/budgets-page.tsx`, `pages/goals-page.tsx` |
| Insights | `(tabs)/insights` | Range select (3/6/12 months), summary stats, trend chart, category breakdown | `pages/analytics-page.tsx`, `pages/analytics/*` |
| More | `(tabs)/more` | Accounts, Categories, Settings/Profile, Sign out | `pages/accounts-page.tsx`, `pages/categories-page.tsx` |

- Home and Transactions have an **Add transaction** header button (`plus` icon) that opens
  `/transactions/new`.
- "New transfer" is offered from the Transactions header menu and from an account's detail screen.

The dashboard card order on Home follows the web's priority:

1. Balance overview (net worth, month-over-month tiles, income/expense chart)
2. Spending limit (budgets)
3. Transaction history (latest 6)
4. Goal tracker
5. Cost analysis
6. Financial health

### Build phases

| Phase | Scope |
|---|---|
| **0 — Foundation** | <ul><li>Run `npm run reset-project`, or remove the template demo files by hand: `hello-wave`, `parallax-scroll-view`, `explore`, `modal`, and the React logo images.</li><li>Rename the app in `app.json`: name `Finch`, slug, scheme `finch`, iOS `bundleIdentifier` and Android `package`.</li><li>Install the stack.</li><li>Add `global.css` tokens, `constants/theme.ts`, Geist, and the `components/ui` primitives.</li><li>Add the `typecheck` and `test` scripts and `.env.example`.</li><li>Brand assets: icon and splash.</li></ul> |
| **1 — Core** | <ul><li>Auth: sign in, sign up, session restore, 401 handling.</li><li>API layer and query hooks.</li><li>Home: all six cards.</li><li>Transactions: list, filters, add, edit, delete.</li><li>Accounts: list, add, edit, delete.</li></ul> |
| **2 — Planning** | Categories, Budgets, Goals (the Plan tab), Transfers. |
| **3 — Insights & settings** | <ul><li>Insights charts.</li><li>Settings/Profile: name, email, password via `PATCH /users/me`; delete account via `DELETE /users/me`.</li><li>Dark-mode and accessibility pass.</li><li>EAS preview builds.</li></ul> |

Each phase ends with the checklist in `AGENTS.md` passing on both platforms.

### Backend dependencies

These are outside this repo; they live in `finance-app/backend`, tracked in its
`docs/upcoming-features.md`:

- **#13 Token refresh and logout.** Until this ships, users are signed out when the 1-day JWT
  expires. When it lands, add refresh handling inside `apiRequest`; screens don't need to change.
- **CORS:** native requests ignore CORS. Only add an origin to `CORS_ORIGINS` if Expo web becomes a
  target.
- **Schema drift:** there is no shared package. When `backend/src/db/schema.ts` or a module's
  `*.schema.ts` changes, update the matching `lib/<resource>.ts` types and `lib/schemas/` in this
  repo, and in the web frontend.

## Current state

Phase 0 has not started. The repo contains only the Expo template.
