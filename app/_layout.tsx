import { Drawer } from "@/components/Drawer"
import { HeaderBackButton } from "@/components/HeaderBackButton"
import { fonts } from "@/constants/fonts"
import { useInitializeLocalizations } from "@/hooks/use-initialize-localization"
import { isAuthenticatedAtom } from "@/store/auth"
import { isWelcomeViewedAtom } from "@/store/welcome"
import { getWelcomeScreenLink } from "@/utils/links"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useAtomValue } from "jotai"
import { useEffect, type FC } from "react"
import { useColorScheme } from "react-native"
import "react-native-reanimated"

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

SplashScreen.preventAutoHideAsync()

const SplashScreenController: FC = () => {
  const [loaded] = useFonts({
    [fonts.publicSans.regular]: require("../assets/fonts/PublicSans-Regular.ttf"),
    [fonts.publicSans.bold]: require("../assets/fonts/PublicSans-Bold.ttf"),
    [fonts.publicSans.italic]: require("../assets/fonts/PublicSans-Italic.ttf"),
    [fonts.publicSans.light]: require("../assets/fonts/PublicSans-Light.ttf"),
    [fonts.publicSans.medium]: require("../assets/fonts/PublicSans-Medium.ttf"),
    [fonts.publicSans.boldItalic]: require("../assets/fonts/PublicSans-BoldItalic.ttf"),
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
  useEffect(
    () => {
      if (!isAuthenticated) return

      const checkOnboarding = async () => {
        // TODO maybe return user to the initial screen
        if (!isWelcomeViewed) router.replace(getWelcomeScreenLink())
      }

      checkOnboarding()
    },
    // Check initial isWelcomeViewed only
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated],
  )

  return (
    <Drawer>
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="groups/[id]" options={{ title: "Group" }} />
          <Stack.Screen name="companies" options={{ title: "Companies" }} />
          <Stack.Screen
            name="data-generating"
            options={{ headerShown: false, title: "Data Generating" }}
          />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
          <Stack.Screen
            name="manage-connection/[id]"
            options={{ title: "Manage Connection", headerLeft: () => <HeaderBackButton /> }}
          />
          <Stack.Screen
            name="manage-contact/[id]"
            options={{ title: "Manage Contact", headerLeft: () => <HeaderBackButton /> }}
          />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>

      <StatusBar style="auto" />
    </Drawer>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    // FIXME remove false - it's a workaround for dark mode absence
    <ThemeProvider value={colorScheme === "dark" && false ? DarkTheme : DefaultTheme}>
      <SplashScreenController />
      <BottomSheetModalProvider>
        <RootNavigator />
      </BottomSheetModalProvider>
    </ThemeProvider>
  )
}
