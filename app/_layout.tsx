import { Drawer } from "@/components/Drawer"
import { HeaderLeft, HeaderRight } from "@/components/Header"
import { HeaderBackButton } from "@/components/HeaderBackButton"
import { fonts } from "@/constants/fonts"
import { useThemeColor } from "@/hooks/useThemeColor"
import { isAuthenticatedAtom } from "@/store/auth"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useAtomValue } from "jotai"
import { type FC } from "react"
import { Text, useColorScheme } from "react-native"
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

  if (!loaded) {
    SplashScreen.hideAsync()
  }

  return null
}

const RootNavigator: FC = () => {
  const headerBgColor = useThemeColor("primary")
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  return (
    <Drawer>
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "Groups",
              headerShown: true,
              headerTitle: "",
              headerLeft: () => (
                <HeaderLeft>
                  <Text>Groups</Text>
                </HeaderLeft>
              ),
              headerRight: HeaderRight,
              headerStyle: {
                backgroundColor: headerBgColor,
              },
            }}
          />

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
