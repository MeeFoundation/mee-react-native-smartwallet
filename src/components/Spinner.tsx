import { LogoCharSvg } from "@assets/index"
import { colors } from "@utils/theme"
import { useEffect, useRef } from "react"
import { Animated, Easing, StyleSheet, View } from "react-native"
import Svg, { Circle } from "react-native-svg"

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
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    spinAnimation.start()

    return () => spinAnimation.stop()
  }, [rotateValue])

  // Interpolate the rotation value to degrees
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "270deg"],
  })

  return (
    <View style={styles.loader}>
      <LogoCharSvg width={100} height={100} />
      <Animated.View
        style={{ transform: [{ rotate }], transformOrigin: "center", position: "absolute" }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <AnimatedCircle
            cx={radius}
            cy={radius}
            r={radius - 3}
            fill="transparent"
            stroke="white"
            strokeWidth="6"
            strokeDasharray={circleCircumference} // Total length of the stroke
            strokeDashoffset={strokeDashoffset} // Animated offset for progress
            strokeLinecap="round" // Smooth edges
          />
        </Svg>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    width: 220,
    height: 220,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
})
