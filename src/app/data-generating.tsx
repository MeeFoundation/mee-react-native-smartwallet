import { colors } from "@/shared/config"
import {
  createSelfInMee,
  generateEncryptionKey,
  generateUniqueDeviceKeys,
  generateUserIdentifier,
} from "@/shared/lib/data"
import { Loader } from "@/shared/ui/Loader"
import { Typography } from "@/shared/ui/Typography"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, StyleSheet } from "react-native"

const steps = [
  { title: "Generating unique device keys", function: generateUniqueDeviceKeys },
  { title: "Generating context data encryption keys", function: generateEncryptionKey },
  { title: "Generating context-specific user identifier", function: generateUserIdentifier },
  { title: "Creating Self in the Mee data storage", function: createSelfInMee },
]

export default function DataGenerating() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(-1)
  const [loading, setLoading] = useState(true)
  const textOpacityValue = useRef(new Animated.Value(0)).current
  const loaderOpacityValue = useRef(new Animated.Value(1)).current
  const scaleValue = useRef(new Animated.Value(1)).current
  const bgColor = useRef(new Animated.Value(0)).current

  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.white, colors.primary],
  })

  useEffect(() => {
    const runSteps = async () => {
      setLoading(true)
      const totalSteps = steps.length
      await new Promise((resolve) => setTimeout(resolve, 400))
      for (let i = 0; i < totalSteps; i++) {
        setCurrentStep(i)
        setProgress(((i + 1) / totalSteps) * 100)
        await steps[i].function()
      }
      setLoading(false)
    }

    // TODO add error handling
    runSteps().catch((err) => {
      console.error("error running steps", err)
    })
  }, [])

  const onFinishAnimation = () => {
    Animated.sequence([
      Animated.timing(textOpacityValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 3,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(bgColor, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(loaderOpacityValue, {
          toValue: 0,
          delay: 500,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => router.navigate("/welcome"))
  }

  useEffect(() => {
    if (loading) {
      Animated.timing(textOpacityValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    } else {
      onFinishAnimation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return (
    <Animated.View
      style={[styles.container, { backgroundColor, transform: [{ scale: scaleValue }] }]}
    >
      <Animated.View style={{ opacity: loaderOpacityValue, transform: [{ scale: scaleValue }] }}>
        <Loader progress={progress} />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacityValue }}>
        <Typography weight="500">{steps[currentStep]?.title ?? ""}</Typography>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    width: Dimensions.get("screen").width,
  },
  text: {
    fontSize: 18,
  },
})
