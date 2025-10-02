import type { FC } from 'react'
import ContentLoader, { Circle, type IContentLoaderProps, Rect } from 'react-content-loader/native'
import { View } from 'react-native'

import { cn } from '../lib/styling'

/* -------------------------------------------------------------------------------------------------
 * Skeleton
 * -----------------------------------------------------------------------------------------------*/
type SkeletonProps = IContentLoaderProps

const Skeleton: FC<SkeletonProps> = ({ className, ...rest }) => (
  <View className={cn('bg-black/5', className)}>
    <ContentLoader
      backgroundColor="#111827"
      backgroundOpacity={0.15}
      foregroundColor="#111827"
      foregroundOpacity={0.07}
      speed={2}
      {...rest}
    />
  </View>
)

/* -----------------------------------------------------------------------------------------------*/

export { Skeleton as Root, Rect, Circle }

export { Skeleton }

export type { SkeletonProps }
