import { Cloud1Svg, Cloud2Svg } from '@/assets/images'

import type { WelcomeSlide } from './WelcomeItem'

export const welcomeSlides: WelcomeSlide[] = [
  {
    btn: false,
    CloudImage: Cloud1Svg,
  },
  {
    btn: true,
    CloudImage: Cloud2Svg,
  },
]
