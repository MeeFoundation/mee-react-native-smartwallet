import type { FC } from 'react'
import { Text, type TextProps } from 'react-native'

import { cn } from '../lib/styling'

/* -------------------------------------------------------------------------------------------------
 * Typography
 * -----------------------------------------------------------------------------------------------*/
type TypographyProps = TextProps

const Typography: FC<TypographyProps> = ({ className, ...rest }) => (
  <Text className={cn('font-publicSans text-[#111827] text-base', className)} {...rest} />
)

/* -----------------------------------------------------------------------------------------------*/

export { Typography }
export type { TypographyProps }
