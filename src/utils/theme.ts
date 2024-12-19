import { Appearance } from "react-native"

export const fonts = {
  publicSans: {
    regular: "PublicSans-Regular",
    bold: "PublicSans-Bold",
    medium: "PublicSans-Medium",
  },
} as const

const colorScheme = Appearance.getColorScheme()

export const lightColors = {
  primary: "#4F868E",
  primaryActive: "#69A0A7",
  tabBarActiveColor: "#4f868e80",
  white: "#FFFFFF",
  transparent: "transparent",
  transparentActive: "#CBD5E1",
  danger: "#EF4444",
  dangerActive: "#F87171",
  link: "blue",
  "gray-100": "#F5F6F6",
  "gray-200": "#D1D2D1",
  "gray-400": "#A1A4A3",
  secondary: "#111827",
}

// TODO - Add dark mode colors
export const darkColors: typeof lightColors = {
  ...lightColors,
}

export const colors = colorScheme === "dark" ? darkColors : lightColors
