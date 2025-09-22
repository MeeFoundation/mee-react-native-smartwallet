import Background from "@/assets/images/background.svg"
import type { FC } from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
import type { SvgProps } from "react-native-svg"

const styles = StyleSheet.create({
  backgroundLayout: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
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
      <SvgComponent width="100%" height="100%" />
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { BackgroundLayout }
export type { BackgroundLayoutProps }
