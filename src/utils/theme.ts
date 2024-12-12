import { Appearance } from "react-native"

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
