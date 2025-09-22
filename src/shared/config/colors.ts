import { Appearance } from 'react-native'

const blackPaletteLight = {
  black: '#000000',
  'black/05': 'rgba(0, 0, 0, 0.05)',
  'black/07': 'rgba(0, 0, 0, 0.07)',
  'black/10': 'rgba(0, 0, 0, 0.1)',
  'black/40': 'rgba(0, 0, 0, 0.4)',
} as const

const whitePaletteLight = {
  white: '#FFFFFF',
  'white/60': 'rgba(255, 255, 255, 0.6)',
  'white/80': 'rgba(255, 255, 255, 0.8)',
  'white/90': 'rgba(255, 255, 255, 0.9)',
  'white/95': 'rgba(255, 255, 255, 0.95)',
} as const

const grayPaletteLight = {
  gray: '#AEAEB2',
  'gray-100': '#F5F6F6',
  'gray-200': '#D1D2D1',
  'gray-400': '#A1A4A3',
  'gray-600': '#747776',
  'gray-800': '#464A48',
  'gray-900': '#111827',
} as const

/**
 * Mee/Primary - #4F868E
 */
const primaryPaletteLight = {
  primary: '#4F868E',
  primaryActive: '#69A0A7',
  tabBarActiveColor: '#4f868e80',
} as const

const redPaletteLight = {
  'red-700': '#B91C1C',
} as const

const bluePaletteLight = {
  blue: '#0A84FF',
  'blue-700': '#4A6CD7',
} as const

const lightPalette = {
  ...grayPaletteLight,
  ...blackPaletteLight,
  ...whitePaletteLight,
  ...primaryPaletteLight,
  ...redPaletteLight,
  ...bluePaletteLight,
  action: grayPaletteLight['gray-600'],
  border: grayPaletteLight['gray-200'],

  /**
   * Danger colors
   */
  // TODO this colors should be based on red palette
  danger: '#EF4444',
  dangerActive: '#F87171',
  dangerLight: '#FF3B30',
  link: '#007AFF',

  /**
   * Semantic colors
   */
  secondary: grayPaletteLight['gray-900'],
  surface: grayPaletteLight['gray-100'],
  systemBackground: '#FAFAFA',
  tertiary: '#7676801F',
  transparent: 'transparent',
  transparentActive: '#606264',

  /**
   * Warning colors
   */
  // TODO this colors should be based on red palette
  warning: '#F9DF89',
}

export const palettes = {
  // FIXME add dark palette
  dark: lightPalette,
  light: lightPalette,
}

const colorScheme = Appearance.getColorScheme()

export const colors = colorScheme === 'dark' ? palettes.dark : palettes.light
