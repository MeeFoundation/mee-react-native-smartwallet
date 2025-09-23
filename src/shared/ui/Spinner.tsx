import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { LogoCharSvg } from '@/assets/images'

import { colors } from '@/shared/config'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const size = 172

export const Spinner = () => {
  const rotateValue = useRef(new Animated.Value(0)).current
  const radius = size / 2
  const circleCircumference = 2 * Math.PI * radius
  const strokeDashoffset = circleCircumference - (circleCircumference * 92) / 100

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        duration: 1000,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    )
    spinAnimation.start()

    return () => spinAnimation.stop()
  }, [rotateValue])

  // Interpolate the rotation value to degrees
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '270deg'],
  })

  return (
    <View style={styles.loader}>
      <LogoCharSvg height={100} width={100} />
      <Animated.View style={{ position: 'absolute', transform: [{ rotate }], transformOrigin: 'center' }}>
        <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
          <AnimatedCircle
            cx={radius}
            cy={radius}
            fill="transparent"
            r={radius - 3}
            stroke="white"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset} // Total length of the stroke
            strokeLinecap="round" // Animated offset for progress
            strokeWidth="3" // Smooth edges
          />
        </Svg>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 220,
    justifyContent: 'center',
    width: 220,
  },
})
