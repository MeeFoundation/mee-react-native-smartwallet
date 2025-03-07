import { BlurView } from "@react-native-community/blur"
import { FC } from "react"
import { View } from "react-native"
import Svg, { Ellipse, G } from "react-native-svg"

export const BackgroundLayout: FC = () => {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Svg width="100%" height="100%" viewBox="400 600 300 612">
        <G opacity="0.75">
          <Ellipse
            cx="664.625"
            cy="664.624"
            rx="185.5"
            ry="324.5"
            transform="rotate(45 664.625 664.624)"
            fill="#F9DF89"
          />
        </G>
        <G opacity="0.75">
          <Ellipse
            cx="674.541"
            cy="1116.54"
            rx="213.387"
            ry="267"
            transform="rotate(45 674.541 1116.54)"
            fill="#d19bca"
          />
        </G>
      </Svg>
      <BlurView
        key="blurryImage"
        blurType="light"
        blurAmount={25}
        blurRadius={25}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        reducedTransparencyFallbackColor="white"
      ></BlurView>
    </View>
  )
}
