import type { FC } from 'react'
import { Text, type TextProps } from 'react-native'

import { colors, type FontFamilyName, fonts } from '@/shared/config'

type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

const DEFAULT_FONT_SIZE: FontFamilyName = fonts.publicSans.regular
const DEFAULT_FONT_WEIGHT: FontWeight = '400'
const DEFAULT_COLOR = colors.secondary

/* -------------------------------------------------------------------------------------------------
 * Typography
 * -----------------------------------------------------------------------------------------------*/
type TypographyProps = TextProps & {
  fontFamily?: FontFamilyName
  weight?: FontWeight
}

const Typography: FC<TypographyProps> = ({ fontFamily, style, weight, ...rest }) => {
  const defaultStyles = {
    color: DEFAULT_COLOR,
    fontFamily: fontFamily || DEFAULT_FONT_SIZE,
    fontWeight: weight || DEFAULT_FONT_WEIGHT,
  }

  return <Text style={[defaultStyles, style]} {...rest} />
}

/* -----------------------------------------------------------------------------------------------*/

export { Typography }
export type { TypographyProps }
