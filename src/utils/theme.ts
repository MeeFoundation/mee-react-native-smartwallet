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
   * Default/SystemBlue/Light - #007AFF
   */
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
}

// TODO - Add dark mode colors
export const darkColors: typeof lightColors = {
  ...lightColors,
}

export const colors = colorScheme === "dark" ? darkColors : lightColors

export const hexAlphaColor = (hex: string, opacityPercent: number) => {
  const decimal = `0${Math.round(255 * (opacityPercent / 100)).toString(16)}`
    .slice(-2)
    .toUpperCase()
  return hex + decimal
}
