import Background from "@assets/images/background.svg"
import { BlurView } from "@react-native-community/blur"
import { FC } from "react"

export const BackgroundLayout: FC = () => {
  return (
    <BlurView
      blurType="light"
      blurAmount={25}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Background width="100%" height="100%" />
    </BlurView>
  )
}
