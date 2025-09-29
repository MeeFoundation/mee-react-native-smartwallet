import type { FC } from 'react'
import { View, type ViewProps } from 'react-native'

import { cn } from '@/shared/lib/cn'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import { Spinner } from '@/shared/ui/Spinner'

/* -------------------------------------------------------------------------------------------------
 * LoadingScreen
 * -----------------------------------------------------------------------------------------------*/
type LoadingScreenProps = ViewProps

const LoadingScreen: FC<LoadingScreenProps> = ({ children, className, style, ...rest }) => (
  <View className={cn('items-center justify-center', className)} style={[{ flex: 1 }, style]} {...rest}>
    <BackgroundLayout />
    <View className="size-11">
      <Spinner />
    </View>
  </View>
)

/* -----------------------------------------------------------------------------------------------*/

export { LoadingScreen }

export type { LoadingScreenProps }
