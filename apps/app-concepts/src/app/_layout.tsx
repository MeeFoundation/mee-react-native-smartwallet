import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useAtomValue } from 'jotai'
import { type FC, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'

import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Drawer } from '@/widgets/drawer'
import { isWelcomeViewedAtom } from '@/widgets/welcome'

import { isAuthenticatedAtom } from '@/features/auth'
import { useInitializeLocalizations } from '@/features/localization'

import '@/shared/global.css'

import { fonts } from '@/shared/config'

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

SplashScreen.preventAutoHideAsync()

const SplashScreenController: FC = () => {
  // FIXME
  const [loaded] = useFonts({
    [fonts.publicSans.regular]: require('../../assets/fonts/PublicSans-Regular.ttf'),
    [fonts.publicSans.bold]: require('../../assets/fonts/PublicSans-Bold.ttf'),
    [fonts.publicSans.italic]: require('../../assets/fonts/PublicSans-Italic.ttf'),
    [fonts.publicSans.light]: require('../../assets/fonts/PublicSans-Light.ttf'),
    [fonts.publicSans.medium]: require('../../assets/fonts/PublicSans-Medium.ttf'),
    [fonts.publicSans.boldItalic]: require('../../assets/fonts/PublicSans-BoldItalic.ttf'),
  })

  const localizationInitialized = useInitializeLocalizations()

  if (loaded && localizationInitialized) {
    SplashScreen.hideAsync()
  }

  return null
}

const RootNavigator: FC = () => {
  const router = useRouter()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const isWelcomeViewed = useAtomValue(isWelcomeViewedAtom)

  // FIXME there is something wring with awaiting fir initialization complete => check render race conditions
  // biome-ignore lint/correctness/useExhaustiveDependencies: check initial isWelcomeViewed only
  useEffect(() => {
    if (!isAuthenticated) return

    const checkOnboarding = async () => {
      // TODO maybe return user to the initial screen
      if (!isWelcomeViewed) router.replace('/welcome')
    }

    checkOnboarding()
  }, [isAuthenticated])

  return (
    <Drawer>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          {/* TODO Charck whether we need to keep all of the following stack screens? */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="groups/[id]" />
          <Stack.Screen name="companies" />
          <Stack.Screen name="data-generating" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="manage-connection/[id]" />
          <Stack.Screen name="manage-contact/[id]" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>

      <StatusBar style="auto" />
    </Drawer>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SplashScreenController />
        <BottomSheetModalProvider>
          <RootNavigator />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}
