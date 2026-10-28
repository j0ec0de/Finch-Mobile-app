# Finch Mobile — Design Rules

This is the native version of the web app's design system
(`finance-app/frontend/DESIGN.md`, `finance-app/frontend/src/index.css`).
The aim is that Finch on a phone looks like the same product as Finch in a browser.
Native conventions win where the two differ: touch sizes, sheets, Dynamic Type.

This file is the source of truth before styling anything. Update it when you make a deliberate
system-wide change; don't invent a new look for one screen. When a token value changes on the
web, change it here and in `global.css` too.

## Identity

- Product name: **Finch**.
- Mark: a `PiggyBank` icon (lucide) in a 32pt `rounded-lg` `bg-primary` square, with the icon at
  16pt in `text-primary-foreground`. The `BrandMark` component draws it.
  - The web uses Wallet in places (the sidebar and the favicon). **Mobile uses PiggyBank
    everywhere**, including the app icon, adaptive icon and splash screen.
- Wordmark: "Finch", `text-base font-semibold`, next to the mark.
- App icon and splash: the mark on a `#171717` background, with the dark splash on `#0a0a0a`.

## Color

The palette is monochrome by default; there is **no brand accent color**. `primary` is near-black
in light mode and near-white in dark mode. Color carries meaning, not decoration:

- `status-good` / `status-critical`: income vs expense amounts, up/down deltas, health states.
- `chart-1` … `chart-6`: chart series only.
- `destructive`: errors and destructive actions.

### Tokens

React Native can't render `oklch()`. The web's neutral tokens are listed here as their exact
Tailwind v4 neutral-scale hex equivalents (the web values are in brackets). Status and chart colors
are copied unchanged from `index.css`.

| Token | Light | Dark |
|---|---|---|
| `background` | `#ffffff` (oklch 1) | `#0a0a0a` (0.145) |
| `foreground` | `#0a0a0a` (0.145) | `#fafafa` (0.985) |
| `card` | `#ffffff` | `#171717` (0.205) |
| `card-foreground` | `#0a0a0a` | `#fafafa` |
| `primary` | `#171717` (0.205) | `#e5e5e5` (0.922) |
| `primary-foreground` | `#fafafa` | `#171717` |
| `secondary` / `muted` / `accent` | `#f5f5f5` (0.97) | `#262626` (0.269) |
| `secondary-foreground` / `accent-foreground` | `#171717` | `#fafafa` |
| `muted-foreground` | `#737373` (0.556) | `#a1a1a1` (0.708) |
| `border` | `#e5e5e5` (0.922) | `rgba(255,255,255,0.10)` |
| `input` | `#e5e5e5` | `rgba(255,255,255,0.15)` |
| `ring` | `#a1a1a1` (0.708) | `#737373` (0.556) |
| `destructive` | `#e7000b` | `#ff6467` |
| `status-good` | `#0ca30c` | `#0ca30c` |
| `status-critical` | `#d03b3b` | `#e66767` |
| `chart-1` | `#2a78d6` | `#3987e5` |
| `chart-2` | `#eb6834` | `#d95926` |
| `chart-3` | `#1baf7a` | `#199e70` |
| `chart-4` | `#eda100` | `#c98500` |
| `chart-5` | `#e87ba4` | `#d55181` |
| `chart-6` | `#4a3aa7` | `#9085e9` |

Where they live:

- `global.css` defines these as CSS variables (`:root` plus the dark-scheme block) and exposes them
  as Tailwind colors (`bg-card`, `text-muted-foreground`, `text-status-good`, `bg-chart-1`, ...).
- `constants/theme.ts` mirrors them as a typed `{ light, dark }` object for charts and the
  navigation theme.

The two files must always agree. **Never hardcode a color in a component.**

### Income and expense

The web is inconsistent here (one page uses `emerald-600`). Mobile has one rule:

- **Amounts:** income is `text-status-good`, prefixed `+`. Expense is `text-status-critical`,
  prefixed `−` (U+2212). Transfers use `text-foreground` with no sign color.
- **Chart series:** income is `chart-1` and expenses are `chart-2`, matching the web charts. Status
  colors are never used as chart series.
- **Deltas:** `status-good` when the change is good for the user. A rise in spending is
  `status-critical` even though the number went up.

Color is never the only signal: amounts also carry a sign, and deltas carry an arrow icon.

### No decoration

- No gradients, glassmorphism, glow, or blur.
- Surfaces are flat. Separation comes from a hairline `border-border` on cards, the native
  equivalent of the web's `ring-1 ring-foreground/10`, or from list separators. Never from
  shadows.
  - Native sheets, menus and alerts keep the system's own elevation.

## Dark mode

Dark mode is supported from day one and follows the system (`userInterfaceStyle: "automatic"` in
`app.json`). The web defines dark tokens but never turns them on; mobile does.

- Everything is token-driven: switching scheme only swaps the variable values.
- **Never write manual `dark:` colors.** If a token has no equivalent, add one.
- `StatusBar` style, the navigation theme and chart colors read from `constants/theme.ts` using the
  current scheme.
- A manual light/dark/system override in Settings is optional (Phase 3). If it's added, it sets
  NativeWind's color scheme and nothing else changes.

## Typography

- **Font:** Geist (Regular 400, Medium 500, SemiBold 600), loaded with `expo-font` and mapped to
  `font-sans`. Never use other weights or another typeface.
- **Scale:** mobile shifts the web's scale up one step for legibility. Body text is 16, not 14.

| Class | Size / line height | Use |
|---|---|---|
| `text-xs` | 12 / 16 | metadata: timestamps, chart axes, badges |
| `text-sm` | 14 / 20 | secondary text, labels, list-row subtitles |
| `text-base` | 16 / 24 | body text, inputs, list-row titles, card titles |
| `text-lg` | 18 / 28 | section headings |
| `text-xl` | 20 / 28 | screen titles inside content (large native titles are separate) |
| `text-2xl` | 24 / 32 | stat numbers |
| `text-3xl` | 30 / 36 | **only** the net-worth figure on Home |

- **Weights:** `font-medium` for labels, titles and emphasis; `font-semibold` for the wordmark and
  large numbers. Body text is regular.
- **Numbers:** every money amount uses `tabular-nums` (`fontVariant: ['tabular-nums']`), so digits
  line up in lists. Amounts come from `formatCurrency` in `lib/format.ts`; never format them inline.
- **Dynamic Type:** text scales with the OS setting. Dense rows (list rows, stat tiles, chart
  labels) cap scaling with `maxFontSizeMultiplier={1.5}`. Body text is not capped. Layouts must
  wrap instead of clipping.

## Spacing & layout

- 4pt grid, using Tailwind's spacing scale.
- **Screen gutter:** `px-4` (16pt). Vertical gap between sections or cards: `gap-4`.
- **Card padding:** `p-4`, or `p-3` for the compact variant.
- **Forms:** `gap-1.5` between a label and its input; `gap-4` between fields.
- **List rows:** at least 56pt tall, `px-4`, with hairline separators inset to the text.
- **One column:** the web's multi-column dashboard grid becomes a single stack, ordered as in
  `CLAUDE.md` → Navigation map.
- **Tablets** (`supportsTablet: true`): content width is capped at 640pt and centered. There is no
  separate tablet layout.

## Radius

One scale, from the web's `--radius: 0.625rem` = 10pt:

| Class | Value | Use |
|---|---|---|
| `rounded-sm` | 6 | small inner elements, chart bar corners (4px on web → 4pt) |
| `rounded-md` | 8 | — |
| `rounded-lg` | 10 | buttons, inputs, icon tiles, the brand mark |
| `rounded-xl` | 14 | cards, empty-state blocks |
| `rounded-full` | — | badges, pills, avatars, meter tracks |

Never use an arbitrary radius.

## Components

The primitives live in `components/ui/`. Build each once and reuse it.

- **Button:**
  - Variants (as on the web): `default` (`bg-primary`), `outline`, `secondary`, `ghost`,
    `destructive`, `link`.
  - Sizes: `default` is 44pt tall; `sm` is 36pt, but it still gets a 44pt hit area through
    `hitSlop`. Always `rounded-lg`, label `text-base font-medium`.
  - Pressed state: `opacity-80`. Disabled: `opacity-50` with a changed label while submitting.
- **Input:** 44pt tall, `rounded-lg`, `border border-input`, `bg-background`, `text-base`.
  - Focused: `border-ring`.
  - Error: `border-destructive` plus an error line below it.
  - Always has a label above it. Placeholders are hints, never labels.
- **Select / picker:** a pressable that looks like an Input and opens a native action sheet or a
  list sheet. Used for account, category, currency, period and type.
- **Segmented control:** for two or three mutually exclusive options (Expense/Income in the
  transaction form, Budgets/Goals on the Plan tab, chart ranges).
- **Card:** `bg-card rounded-xl border border-border p-4`, no shadow. The title is
  `text-base font-medium`; an optional action sits top-right as a `ghost` button or a chevron.
- **ListRow:**
  - Left: an optional 36pt icon tile (`bg-muted rounded-lg`).
  - Middle: the title (`text-base`) and subtitle (`text-sm text-muted-foreground`, holding the
    category · account · date).
  - Right: the amount, right-aligned, `tabular-nums`, colored as in *Income and expense*.
  - The whole row is one pressable.
- **Badge:** `rounded-full` pill, 20pt tall, `text-xs font-medium`. `secondary` style by default,
  used for short tags such as "Transfer" or the category type.
- **StatTile:** label (`text-sm text-muted-foreground`), value (`text-2xl font-semibold
  tabular-nums`), delta row (a 14pt TrendingUp/TrendingDown icon plus a percentage in a status
  color).
- **Meter (progress):** 8pt `rounded-full` track filled with `chart-1`.
  - The track is the fill color at 16% opacity, as on the web.
  - Over 100% (budget overspent): the fill becomes `status-critical`.
  - Labels sit above it: spent / limit on the left, remaining on the right.
- **EmptyState:** a dashed `border-border` `rounded-xl` block containing a 20pt icon in a 40pt
  `bg-muted` circle, a title (`text-base font-medium`), one line of `text-sm text-muted-foreground`
  text, and a primary button that creates the first item.
- **Skeleton:** `bg-muted rounded-md` blocks shaped like the content. Static, or a slow opacity
  pulse that turns off when Reduce Motion is on.
- **Icons:** `lucide-react-native` with a 1.75 stroke width.
  - Sizes: 16 inline, 20 in buttons and rows, 24 in tab bars and headers.
  - Color comes from the text token in context (`foreground` / `muted-foreground`).
  - Tab icons:

    | Tab | Icon |
    |---|---|
    | Home | LayoutDashboard |
    | Transactions | ArrowLeftRight |
    | Plan | PiggyBank |
    | Insights | LineChart |
    | More | Ellipsis |

  - Accounts (`Wallet`), Categories (`Tags`) and Goals (`Target`) keep their web icons inside
    screens.
- **Tab bar:** the native tab bar. Active tab is `foreground`, inactive is `muted-foreground`, no
  colored tint.
- **Toasts:** sonner-native, at the top. They confirm a success ("Transaction added") but never
  replace an inline error.

## Charts

The charts use `victory-native` (Skia); the gauge uses `react-native-svg`. Colors come from `constants/theme.ts` (`chart-1` …
`chart-6`) for the current scheme, never from literals.

| Web chart | Mobile version |
|---|---|
| Balance overview (Home): grouped bars, income vs expense | Grouped vertical bars, `chart-1` / `chart-2`, 4pt top corners; segmented range 7d · 30d · 6m · 12m |
| Income vs expense trend (Insights) | Monotone line, 2pt stroke, no dots, `chart-1` / `chart-2` |
| Category breakdown (Insights) | Horizontal bars, top 8 categories, `chart-1`…`chart-6` cycled by rank |
| Cost analysis (Home) | One stacked horizontal bar plus a legend list (dot · name · % · amount) |
| Financial health (Home) | Half-ring gauge drawn with `react-native-svg`: track `muted`, value colored by state, percent saved in the middle |

Every chart follows these rules:

- **Size:** full card width, never horizontal scrolling, 200pt tall by default.
- **Axes:** labels `text-xs` in `muted-foreground`; gridlines a hairline `border` color,
  horizontal only; no axis lines.
- **Inspecting values (planned, Phase 3; not built yet):** press and drag to see the value, a vertical guide line and a small
  `bg-card` label with the date and formatted amount. A light haptic tick on each new point.
- **Legend:** a dot plus the label, under the chart, only when there are two or more series.
- **Empty data:** show the card's empty line ("No transactions in this period"), never an empty
  axis box.
- **Accessibility:** each chart has an `accessibilityLabel` summarising it (e.g. "Income $4,200,
  expenses $3,100 over the last 30 days").

## Motion

- **The app is static by default.** Movement comes only from native navigation transitions (push,
  sheet, tab) and native controls.
- No entrance animations on cards, lists or numbers. No count-up numbers. No bouncing.
- **Exception: the auth screens.** As on the web, sign-in and sign-up may have one brand moment: a
  slow drift of blurred `chart-*` color shapes behind the mark on a `bg-primary` header (made with
  Reanimated + Skia). It's limited to the time before sign-in and never appears inside the app.
- **Reduce Motion is always respected:** check `useReducedMotion()` from Reanimated and render the
  still version.

## States & accessibility

- **Errors:**
  - Field errors: inline `text-sm text-destructive` directly under the field.
  - Screen and card load errors: inline message plus a Retry button.
  - Toasts can add to these but never replace them.
- **Disabled and submitting:** `opacity-50` plus a changed label ("Signing in…", "Saving…"), not a
  spinner on its own.
- **Touch targets:** at least 44×44pt everywhere. Use `hitSlop` to get there rather than making
  visible controls bigger.
- **Screen readers:**
  - Every icon-only button has an `accessibilityLabel`.
  - Amounts read naturally: the label includes "income" or "expense" rather than relying on color
    or the sign.
  - Headings use `accessibilityRole="header"`.
- **Contrast:** text meets WCAG AA (4.5:1, or 3:1 for text 18pt and larger) in both themes. Check
  any new token pair before adding it.
- **Focus order:** follows reading order. Forms move field to field with `returnKeyType="next"`.
