import type { FC } from 'react'
import { View, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'

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
      <View
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
      </View>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ScreenLayout
 * -----------------------------------------------------------------------------------------------*/
type ScreenLayoutProps = ViewProps

const ScreenLayout: FC<ScreenLayoutProps> = ({ children, style, ...rest }) => (
  <View style={[{ flex: 1 }, style]} {...rest}>
    <BackgroundLayout />
    {children}
  </View>
)

/* -----------------------------------------------------------------------------------------------*/

export { ScreenLayout as Root, ScreenLayoutContent as Content }

export { ScreenLayout, ScreenLayoutContent }

export type { ScreenLayoutProps, ScreenLayoutContentProps }
