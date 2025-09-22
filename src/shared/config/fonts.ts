export const fonts = {
  publicSans: {
    bold: 'PublicSans-Bold',
    boldItalic: 'PublicSans-BoldItalic',
    italic: 'PublicSans-Italic',
    light: 'PublicSans-Light',
    medium: 'PublicSans-Medium',
    regular: 'PublicSans-Regular',
  },
} as const

export type FontFamilyName = {
  [K in keyof typeof fonts]: (typeof fonts)[K][keyof (typeof fonts)[K]]
}[keyof typeof fonts]
