import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'

import { colors } from '@/shared/config'
import {
  createSelfInMee,
  generateEncryptionKey,
  generateUniqueDeviceKeys,
  generateUserIdentifier,
} from '@/shared/lib/data'
import { Loader } from '@/shared/ui/Loader'
import { Typography } from '@/shared/ui/Typography'

const steps = [
  { function: generateUniqueDeviceKeys, title: 'Generating unique device keys' },
  { function: generateEncryptionKey, title: 'Generating context data encryption keys' },
  { function: generateUserIdentifier, title: 'Generating context-specific user identifier' },
  { function: createSelfInMee, title: 'Creating Self in the Mee data storage' },
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
      console.error('error running steps', err)
    })
  }, [])

  const onFinishAnimation = () => {
    Animated.sequence([
      Animated.timing(textOpacityValue, {
        duration: 500,
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(scaleValue, {
          duration: 2000,
          toValue: 3,
          useNativeDriver: false,
        }),
        Animated.timing(bgColor, {
          duration: 1000,
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.timing(loaderOpacityValue, {
          delay: 500,
          duration: 1500,
          toValue: 0,
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => router.navigate('/welcome'))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: react only on loading
  useEffect(() => {
    if (loading) {
      Animated.timing(textOpacityValue, {
        duration: 200,
        toValue: 1,
        useNativeDriver: false,
      }).start()
    } else {
      onFinishAnimation()
    }
  }, [loading])

  return (
    <Animated.View style={[styles.container, { backgroundColor, transform: [{ scale: scaleValue }] }]}>
      <Animated.View style={{ opacity: loaderOpacityValue, transform: [{ scale: scaleValue }] }}>
        <Loader progress={progress} />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacityValue }}>
        <Typography className="font-medium">{steps[currentStep]?.title ?? ''}</Typography>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 15,
    justifyContent: 'center',
    width: Dimensions.get('screen').width,
  },
  text: {
    fontSize: 18,
  },
})
