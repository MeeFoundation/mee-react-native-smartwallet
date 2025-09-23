import { useRouter } from 'expo-router'
import { useSetAtom } from 'jotai'
import { Dimensions, StyleSheet, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import { BubblesSvg, MeeMascotSvg } from '@/assets/images'

import { colors } from '@/shared/config'
import { AppButton } from '@/shared/ui/AppButton'

import { isWelcomeViewedAtom } from '../model/store'

export type WelcomeSlide = {
  btn?: boolean
  CloudImage: React.ComponentType<SvgProps>
}

export const WelcomeItem = ({ btn = false, CloudImage }: WelcomeSlide) => {
  const router = useRouter()
  const setIsWelcomeViewedAtom = useSetAtom(isWelcomeViewedAtom)
  const handlePress = () => {
    setIsWelcomeViewedAtom(true)
    router.navigate('/')
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <CloudImage height="100%" width="100%" />
      </View>
      <View style={styles.image}>
        <BubblesSvg height="15%" style={{ color: colors.white, marginBottom: 8 }} />
        <MeeMascotSvg height="85%" width="100%" />
      </View>
      <View style={{ alignSelf: 'flex-end', height: 51, width: '100%' }}>
        {btn && (
          <AppButton hitSlop={12} onPress={handlePress} style={styles.button} text="Get Started" variant="secondary" />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: -1,
    paddingHorizontal: 16,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.warning,
    flex: 1,
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 6,
    width: Dimensions.get('screen').width,
  },
  image: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  text: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'light',
    lineHeight: 24,
    textAlign: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontStyle: 'italic',
    lineHeight: 36,
    marginBottom: 8,
    textAlign: 'center',
    zIndex: 1,
  },
})
