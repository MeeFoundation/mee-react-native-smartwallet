import { palettes } from '@/shared/config'

import { useColorScheme } from './useColorScheme'

export const useThemeColor = (
  colorName: keyof typeof palettes.light & keyof typeof palettes.dark,
  params?: { light?: string; dark?: string },
) => {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = params?.[theme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return palettes[theme][colorName]
  }
}
