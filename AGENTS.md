# Mobile Development Rules

These rules apply to all work in this repo. `CLAUDE.md` describes the architecture and
`DESIGN.md` the design system; read both before building a screen.

## Stack

- Expo (SDK 58) + expo-router
- React Native + TypeScript (strict)
- NativeWind (Tailwind CSS v4)
- TanStack Query
- React Hook Form + Zod
- FlashList, victory-native, lucide-react-native, sonner-native

Don't add a library that overlaps one of these: no second state, styling, form, chart or icon
library. If something genuinely needs a new dependency, install it with `npx expo install`, so the
version matches the SDK.

## Architecture

- Files in `app/` are routes only: screen options plus one feature component. Logic lives in
  `features/<area>/`.
- Prefer feature-based organization. Keep components small and composable; split a screen into
  parts rather than growing one giant file.
- Keep API calls outside UI components. Components use hooks from `hooks/`; hooks call
  `lib/<resource>.ts`; only `lib/api.ts` calls `fetch`.
- Avoid `any`. Prefer `unknown` when the type is genuinely unknown, then narrow it.
- Use TypeScript types for every API response, from the ported `lib/<resource>.ts` types.
- When the backend's schema or validation changes, update `lib/` types and `lib/schemas/` in the
  same change.
- Keep ported files close to their web originals (`finance-app/frontend/src/lib`, `src/hooks`).
  Don't refactor them for style; diverge only where the platform requires it.
- Platform-specific code uses `.ios.tsx` / `.android.tsx` / `.web.ts` file suffixes (as the
  template's `icon-symbol.ios.tsx` does), not scattered `Platform.OS` checks.

## UI

- Reuse `components/ui/*` before creating anything new. Never duplicate a primitive inside a
  feature folder.
- Every interactive element is a `Pressable` (or a primitive built on one) with
  `accessibilityRole` and, if it has no visible text, `accessibilityLabel`.
- Respect safe areas: screens use `SafeAreaView` / insets from `react-native-safe-area-context`, and
  nothing is drawn under the notch, the home indicator or the tab bar.
- Use `FlashList` for any list that can grow without bound (transactions). A short fixed list
  (settings rows) can be a plain `View`.
- Use the platform's own patterns:
  - form sheets for create/edit
  - `Alert.alert` for confirmations
  - `RefreshControl` for pull-to-refresh on every list and on Home
  - native header buttons for primary actions
- Text input: the correct `keyboardType` (`decimal-pad` for amounts, `email-address` for email),
  `autoComplete` / `textContentType` on auth fields, `returnKeyType` set so the user can move
  between fields, and screens wrapped so the keyboard never covers the focused input.

## Styling

- Use NativeWind classes with design tokens only (`bg-card`, `text-muted-foreground`,
  `text-status-good`, ...).
- Avoid arbitrary colors: no hex, `rgb()` or Tailwind palette colors (`emerald-600`) in
  components. If a meaning has no token, add one to `global.css` **and** `DESIGN.md`.
- `constants/theme.ts` is the JS mirror of the tokens. Use it only where classes can't reach:
  chart props, the navigation theme, `StatusBar`, native header tint.
- No `StyleSheet.create` or inline `style={{}}`, except for values computed at runtime (chart sizes,
  progress widths, inset padding).
- Avoid excessive shadows: surfaces are flat.
- Avoid excessive rounded containers: don't nest cards in cards.
- Avoid unnecessary animations: see Motion in `DESIGN.md`.
- Never write manual `dark:` colors. Tokens switch automatically.

## UX

Every screen should handle:

- **Loading:** skeletons shaped like the content, not a lone centered spinner.
- **Empty:** the `EmptyState` component, with a call to action that creates the first item.
- **Error:** an inline message plus a Retry action (`refetch`). Never a blank screen.
- **Success:** the data, with pull-to-refresh.

Forms should provide:

- Validation (zod schema in `lib/schemas/`) and inline, field-level error messages.
- The server's `ApiError.message` shown inline above the submit button.
- A disabled submit button while the form is invalid or submitting.
- A loading state with a changed label ("Saving…"), not just a spinner.

Destructive actions (delete, sign out, delete account) need a confirmation `Alert` with a
`destructive`-style button.

Haptics (`expo-haptics`): a light impact on tab press (the template's `HapticTab`), a `success`
notification on a successful save, and a `warning` notification before a destructive confirm.
Nothing else vibrates.

## Performance

- React Compiler is on. Don't add `useMemo`, `useCallback` or `React.memo` by hand unless
  profiling shows a need, and leave a comment saying why when you do.
- Lists need stable keys (`id`), and `FlashList` needs an item type when rows differ.
- Don't fetch in `useEffect`; use React Query. Don't add a `refetchOnMount` / focus override without
  a reason.
- Images use `expo-image`.

## Security

- The token is stored only in `expo-secure-store` (via `use-auth.tsx`), never in AsyncStorage,
  state persisted elsewhere, or logs.
- Never log request bodies, tokens or user financial data. Remove `console.log` before finishing.
- No secrets in `EXPO_PUBLIC_*` variables or `app.json`; both ship inside the app.
- Sign-out and account deletion clear the React Query cache.

## Testing

- Unit-test every pure function in `lib/` (formatting, date ranges, dashboard math, schemas) with
  `jest-expo`.
- Component tests (`@testing-library/react-native`) for non-trivial logic: form validation, auth
  gating, empty and error states.
- Mock at the `lib/<resource>.ts` boundary, not at `fetch`.

## Code Quality

Before finishing a task:

1. Run TypeScript checks (`npm run typecheck`).
2. Run lint (`npm run lint`).
3. Run tests (`npm test`).
4. Check for unused imports and leftover `console.log`s.
5. Run the changed screens on **both** an iOS simulator and an Android emulator, in light **and**
   dark mode.
6. Check accessibility:
   - Large Dynamic Type / font scale: no clipped or overlapping text.
   - Every control has a VoiceOver/TalkBack label.
   - Touch targets are at least 44pt.
7. Update the "Current state" line in `CLAUDE.md` when a build phase or screen is finished.
