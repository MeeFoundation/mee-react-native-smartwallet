import { type FC, Suspense } from 'react'
import { ScrollView, View, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/shared/lib/cn'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import { Spinner } from '@/shared/ui/Spinner'

/* -------------------------------------------------------------------------------------------------
 * ScreenLayoutContent
 * -----------------------------------------------------------------------------------------------*/
type ScreenLayoutContentProps = ViewProps & {
  safeBottomInset?: boolean
  safeTopInset?: boolean
  safeLeftInset?: boolean
  safeRightInset?: boolean
}

const ScreenLayoutContent: FC<ScreenLayoutContentProps> = ({
  style,
  children,
  safeBottomInset,
  safeTopInset,
  safeLeftInset = true,
  safeRightInset = true,
  ...rest
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[{ flex: 1 }, style]} {...rest}>
      <ScrollView
        style={[
          { flex: 1 },
          {
            paddingBottom: safeBottomInset ? insets.bottom : 0,
            paddingLeft: safeLeftInset ? insets.left : 0,
            paddingRight: safeRightInset ? insets.right : 0,
            paddingTop: safeTopInset ? insets.top : 0,
          },
        ]}
      >
        {children}
      </ScrollView>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ScreenLayout
 * -----------------------------------------------------------------------------------------------*/
type ScreenLayoutProps = ViewProps & { fallback?: React.ReactNode }

const ScreenLayout: FC<ScreenLayoutProps> = ({ children, className, style, fallback, ...rest }) => (
  <Suspense
    fallback={
      fallback ?? (
        <View className={cn('items-center justify-center', className)} style={[{ flex: 1 }, style]} {...rest}>
          <BackgroundLayout />
          <View className="size-11">
            <Spinner />
          </View>
        </View>
      )
    }
  >
    <View className={className} style={[{ flex: 1 }, style]} {...rest}>
      <BackgroundLayout />
      {children}
    </View>
  </Suspense>
)

/* -----------------------------------------------------------------------------------------------*/

export { ScreenLayout as Root, ScreenLayoutContent as Content }

export { ScreenLayout, ScreenLayoutContent }

export type { ScreenLayoutProps, ScreenLayoutContentProps }
