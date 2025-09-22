import type { FC } from 'react'
import { StyleSheet } from 'react-native'

import { colors, fonts } from '@/shared/config'
import { Typography, type TypographyProps } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  label: {
    color: colors['gray-900'],
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
})

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/
type LabelProps = TypographyProps

const Label: FC<LabelProps> = ({ style, ...rest }) => (
  <Typography fontFamily={fonts.publicSans.medium} style={[styles.label, style]} {...rest} />
)

/* -----------------------------------------------------------------------------------------------*/

export { Label }
export type { LabelProps }
