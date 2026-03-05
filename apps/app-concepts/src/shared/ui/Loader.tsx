import { type FC, useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'

import { LogoCharSvg } from '@/assets/images'

import { colors } from '@/shared/config'

type LoaderProps = {
  progress: number
}

const size = 172

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const CircleComp: FC<LoaderProps> = ({ progress }) => {
  const radius = size / 2
  const circleCircumference = 2 * Math.PI * radius
  const strokeDashoffset = useRef(new Animated.Value(circleCircumference)).current

  useEffect(() => {
    Animated.timing(strokeDashoffset, {
      duration: 1000, // Adjust duration for smoother or faster animation
      easing: Easing.linear, // Custom easing function
      toValue: circleCircumference - (circleCircumference * progress) / 100,
      useNativeDriver: false, // Must be false for non-transform animations
    }).start()
  }, [progress, circleCircumference, strokeDashoffset])

  return (
    <View style={styles.container}>
      <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <G origin={`${radius}, ${radius}`} rotation="-90">
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
        </G>
      </Svg>
    </View>
  )
}

export const Loader: FC<LoaderProps> = ({ progress }) => {
  return (
    <View style={styles.loader}>
      <LogoCharSvg height={100} width={100} />
      <CircleComp progress={progress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', position: 'absolute' },
  loader: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: 220,
    justifyContent: 'center',
    width: 220,
  },
})
