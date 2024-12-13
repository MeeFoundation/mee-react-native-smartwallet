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
  tabBarActiveColor: "#4f868e80",
  white: "#FFFFFF",
}

// TODO - Add dark mode colors
export const darkColors: typeof lightColors = {
  ...lightColors,
}

export const colors = colorScheme === "dark" ? darkColors : lightColors
