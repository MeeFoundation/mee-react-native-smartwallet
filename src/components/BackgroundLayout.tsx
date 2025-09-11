import Background from "@assets/images/background.svg"
import { FC } from "react"
import { View } from "react-native"
import { SvgProps } from "react-native-svg"

export const BackgroundLayout: FC<{ Svg?: React.ComponentType<SvgProps> }> = ({ Svg }) => {
  const SvgComponent = Svg ?? Background
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        flex: 1,
      }}
    >
      <SvgComponent width="100%" height="100%" />
    </View>
  )
}
