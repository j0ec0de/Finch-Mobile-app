/**
 * JS mirror of the tokens in global.css, for places classes can't reach
 * (charts, the react-navigation theme, StatusBar). Keep both files in sync (see DESIGN.md).
 */

export const Colors = {
  light: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#ffffff',
    cardForeground: '#0a0a0a',
    primary: '#171717',
    primaryForeground: '#fafafa',
    secondary: '#f5f5f5',
    muted: '#f5f5f5',
    mutedForeground: '#737373',
    destructive: '#e7000b',
    border: '#e5e5e5',
    input: '#e5e5e5',
    ring: '#a1a1a1',
    statusGood: '#0ca30c',
    statusCritical: '#d03b3b',
    chart: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#4a3aa7'],
  },
  dark: {
    background: '#0a0a0a',
    foreground: '#fafafa',
    card: '#171717',
    cardForeground: '#fafafa',
    primary: '#e5e5e5',
    primaryForeground: '#171717',
    secondary: '#262626',
    muted: '#262626',
    mutedForeground: '#a1a1a1',
    destructive: '#ff6467',
    border: 'rgba(255,255,255,0.1)',
    input: 'rgba(255,255,255,0.15)',
    ring: '#737373',
    statusGood: '#0ca30c',
    statusCritical: '#e66767',
    chart: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#9085e9'],
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = (typeof Colors)[ColorScheme];

export const Fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
} as const;
