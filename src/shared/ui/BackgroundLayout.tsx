import type { FC } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import Background from '@/assets/images/background.svg'

const styles = StyleSheet.create({
  backgroundLayout: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
})

/* -------------------------------------------------------------------------------------------------
 * BackgroundLayout
 * -----------------------------------------------------------------------------------------------*/
type BackgroundLayoutProps = ViewProps & {
  Svg?: React.ComponentType<SvgProps>
}

const BackgroundLayout: FC<BackgroundLayoutProps> = ({ Svg, style, ...rest }) => {
  const SvgComponent = Svg ?? Background

  return (
    <View style={[styles.backgroundLayout, style]} {...rest}>
      <SvgComponent height="100%" width="100%" />
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { BackgroundLayout }
export type { BackgroundLayoutProps }
