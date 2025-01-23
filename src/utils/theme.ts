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

const lightColors = {
  /**
   * Mee/Primary - #4F868E
   */
  primary: "#4F868E",
  primaryActive: "#69A0A7",
  tabBarActiveColor: "#4f868e80",
  white: "#FFFFFF",
  transparent: "transparent",
  /**
   *  #606264
   */
  transparentActive: "#606264",
  danger: "#EF4444",
  dangerActive: "#F87171",
  /**
   * Mee/Yellow - #007AFF
   */
  warning: "#F9DF89",
  // yellow: "#F9DF89",
  /**
   * Default/SystemBlue/Light - #007AFF
   */
  systemBackground: "#FAFAFA",
  link: "#007AFF",
  gray: "#AEAEB2",
  "gray-100": "#F5F6F6",
  "gray-200": "#D1D2D1",
  "gray-400": "#A1A4A3",
  /**
   * Default/gray/900 - #111827
   */
  secondary: "#111827",
  /**
   * Default/gray/100 - #F5F6F6
   */
  surface: "#F5F6F6",
  /**
   * Default/gray/600 - #747776
   */
  action: "#747776",
  /**
   * Fill Color/Light/Tertiary - #7676801F
   */
  tertiary: "#7676801F",

  /**
   * Default/gray/200 -  #D1D2D1
   */
  border: "#D1D2D1",
}

// TODO - Add dark mode colors
export const darkColors: typeof lightColors = {
  ...lightColors,
}

export const colors = colorScheme === "dark" ? darkColors : lightColors
