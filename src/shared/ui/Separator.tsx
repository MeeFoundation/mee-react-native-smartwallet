import type { FC } from 'react'
import { View, type ViewProps } from 'react-native'

import { cn } from '../lib/cn'

/* -------------------------------------------------------------------------------------------------
 * Separator
 * -----------------------------------------------------------------------------------------------*/
type SeparatorProps = Omit<ViewProps, 'children'>

const Separator: FC<SeparatorProps> = ({ className, ...rest }) => (
  <View className={cn('my-2 border-b border-b-black/7', className)} {...rest} />
)

/* -----------------------------------------------------------------------------------------------*/

export { Separator }

export type { SeparatorProps }
