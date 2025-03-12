import { Cloud1Svg, Cloud2Svg } from "@assets/index"
import { WelcomeSlide } from "./WelcomeItem"

export const welcomeSlides: WelcomeSlide[] = [
  {
    CloudImage: Cloud1Svg,
    btn: false,
  },
  {
    btn: true,
    CloudImage: Cloud2Svg,
  },
]
