import { Appearance } from "react-native"

export const fonts = {
  publicSans: {
    light: "PublicSans-Light",
    regular: "PublicSans-Regular",
    italic: "PublicSans-Italic",
    medium: "PublicSans-Medium",
    bold: "PublicSans-Bold",
    boldItalic: "PublicSans-BoldItalic",
  },
} as const

const colorScheme = Appearance.getColorScheme()

/**
 * Mee/Primary - #4F868E
 */
const primaryPaletteLight = {
  primary: "#4F868E",
  primaryActive: "#69A0A7",
  tabBarActiveColor: "#4f868e80",
} as const

const blackPaletteLight = {
  black: "#000000",
  "black/10": "rgba(0, 0, 0, 0.1)",
  "black/07": "rgba(0, 0, 0, 0.07)",
} as const

const whitePaletteLight = {
  white: "#FFFFFF",
  "white/60": "rgba(255, 255, 255, 0.6)",
  "white/80": "rgba(255, 255, 255, 0.8)",
  "white/90": "rgba(255, 255, 255, 0.9)",
  "white/95": "rgba(255, 255, 255, 0.95)",
} as const

const redPaletteLight = {
  "red-700": "#B91C1C",
} as const

const bluePaletteLight = {
  blue: "#0A84FF",
  "blue-700": "#4A6CD7",
} as const

const grayPaletteLight = {
  gray: "#AEAEB2",
  "gray-100": "#F5F6F6",
  "gray-200": "#D1D2D1",
  "gray-400": "#A1A4A3",
  "gray-600": "#747776",
  "gray-800": "#464A48",
  "gray-900": "#111827",
} as const

const semanticPaletteLight = {
  secondary: grayPaletteLight["gray-900"],
  surface: grayPaletteLight["gray-100"],
  action: grayPaletteLight["gray-600"],
  tertiary: "#7676801F",
  border: grayPaletteLight["gray-200"],
  link: "#007AFF",
  transparentActive: "#606264",
  transparent: "transparent",
  systemBackground: "#FAFAFA",

  /**
   * Danger colors
   */
  // TODO this colors should be based on red palette
  danger: "#EF4444",
  dangerActive: "#F87171",
  dangerLight: "#FF3B30",

  /**
   * Warning colors
   */
  // TODO this colors should be based on red palette
  warning: "#F9DF89",
} as const

const lightColors = {
  ...primaryPaletteLight,
  ...blackPaletteLight,
  ...whitePaletteLight,
  ...redPaletteLight,
  ...bluePaletteLight,
  ...grayPaletteLight,
  ...semanticPaletteLight,
} as const

// TODO - Add dark mode colors
export const darkColors: typeof lightColors = {
  ...lightColors,
}

export const colors = colorScheme === "dark" ? darkColors : lightColors
