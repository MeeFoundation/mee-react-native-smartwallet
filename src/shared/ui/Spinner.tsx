import { type FC, useEffect, useId, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

/* -------------------------------------------------------------------------------------------------
 * Spinner
 * -----------------------------------------------------------------------------------------------*/
const Spinner: FC = () => {
  const gradientId = useId()
  const AnimatedCircle = Animated.createAnimatedComponent(Circle)

  const rotation = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation.current, {
        duration: 1200,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: false,
      }),
    ).start()
  }, [])

  const spin = rotation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const size = 100
  const radius = size / 2

  const circleCircumference = 2 * Math.PI * radius
  const strokeDashoffset = circleCircumference - (circleCircumference * 92) / 100

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <Stop offset="0%" stopColor="#668E4F" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4F868E" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <AnimatedCircle
          cx={50}
          cy={50}
          fill="none"
          r={40}
          stroke={`url(#${gradientId})`}
          strokeDasharray="200"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth="15"
        />
      </Svg>
    </Animated.View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Spinner }
