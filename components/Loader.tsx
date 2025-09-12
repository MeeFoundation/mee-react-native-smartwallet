import { LogoCharSvg } from "@/assets"
import { colors } from "@/constants/colors"
import { type FC, useEffect, useRef } from "react"
import { Animated, Easing, StyleSheet, View } from "react-native"
import Svg, { Circle, G } from "react-native-svg"

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
      toValue: circleCircumference - (circleCircumference * progress) / 100,
      easing: Easing.linear, // Custom easing function
      duration: 1000, // Adjust duration for smoother or faster animation
      useNativeDriver: false, // Must be false for non-transform animations
    }).start()
  }, [progress, circleCircumference, strokeDashoffset])

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          <AnimatedCircle
            cx={radius}
            cy={radius}
            r={radius - 3}
            fill="transparent"
            stroke="white"
            strokeWidth="3"
            strokeDasharray={circleCircumference} // Total length of the stroke
            strokeDashoffset={strokeDashoffset} // Animated offset for progress
            strokeLinecap="round" // Smooth edges
          />
        </G>
      </Svg>
    </View>
  )
}

export const Loader: FC<LoaderProps> = ({ progress }) => {
  return (
    <View style={styles.loader}>
      <LogoCharSvg width={100} height={100} />
      <CircleComp progress={progress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center", flex: 1, position: "absolute" },
  loader: {
    width: 220,
    height: 220,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
})
