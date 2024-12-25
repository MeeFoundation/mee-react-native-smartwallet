import { Appearance } from "react-native"

export const fonts = {
  publicSans: {
    regular: "PublicSansRegular",
    medium: "PublicSansMedium",
    bold: "PublicSansBold",
  },
} as const

const colorScheme = Appearance.getColorScheme()

const lightColors = {
  primary: "#4F868E",
  primaryActive: "#69A0A7",
  tabBarActiveColor: "#4f868e80",
  white: "#FFFFFF",
  transparent: "transparent",
  transparentActive: "#CBD5E1",
  danger: "#EF4444",
  dangerActive: "#F87171",
  link: "blue",
  gray: "#AEAEB2",
  "gray-100": "#F5F6F6",
  "gray-200": "#D1D2D1",
  "gray-400": "#A1A4A3",
  /**
   * Default/gray/900 #111827
   */
  secondary: "#111827",
}

// TODO - Add dark mode colors
export const darkColors: typeof lightColors = {
  ...lightColors,
}

export const colors = colorScheme === "dark" ? darkColors : lightColors
