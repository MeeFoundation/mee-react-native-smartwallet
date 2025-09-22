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

export type FontFamilyName = {
  [K in keyof typeof fonts]: (typeof fonts)[K][keyof (typeof fonts)[K]]
}[keyof typeof fonts]
