import { AppButton } from "@components/AppButton"
import { HeaderLeft, HeaderRight } from "@components/Header"
import { useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Connections } from "@screens/Connections"
import { DataGenerating } from "@screens/DataGenerating"
import { Login } from "@screens/Login"
import { ManageConnection } from "@screens/ManageConnection"
import { ManageContact } from "@screens/ManageContact"
import { Settings } from "@screens/Settings"
import { Welcome } from "@screens/Welcome"
import { isAuthenticatedState } from "@store/index"
import { colors, fonts } from "@utils/theme"
import { useAtomValue } from "jotai"
import { Fragment, useEffect } from "react"
import { Platform, StatusBar } from "react-native"
import { ChevronLeftIcon } from "react-native-heroicons/outline"

export const rootNavigationLinks = {
  home: "Home",
  welcome: "Welcome",
  welcomeItem: "Welcome Item",
  dataGenerating: "DataGenerating",
  getStarted: "Get Started",
  connections: "Connections",
  connectionsItem: "Connections Item",
  categories: "Categories",
  manageConnection: "Manage Connection",
  manageContact: "Manage Contact",
  settings: "Settings",
  login: "Login",
} as const

type RootNavigationLinks = typeof rootNavigationLinks

export type RootNavigationLink = RootNavigationLinks[keyof RootNavigationLinks]

export type RootNavigationLinkObject = { [key in RootNavigationLink]: any }

export type RootStackParamList = {
  "Manage Connection": { id: string }
  "Manage Contact": { id: string }
}

export type RootStackParamListWithLinks = RootStackParamList & RootNavigationLinkObject

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamListWithLinks {}
  }
}

const screenOptions = {
  tabBarActiveTintColor: colors.tabBarActiveColor,
  tabBarInactiveTintColor: colors.primary,
  tabBarLabelStyle: {
    fontFamily: fonts.publicSans.regular,
  },
  headerStyle: { backgroundColor: colors.primary },
  headerLeft: HeaderLeft,
  headerRight: HeaderRight,
  headerTitle: "",
}

const Stack = createNativeStackNavigator()
// const Tab = createBottomTabNavigator()

// const TabsStack = () => {
//   useEffect(() => {
//     if (Platform.OS === "android") {
//       StatusBar.setBackgroundColor(colors.primary)
//     }
//   }, [])

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: colors.tabBarActiveColor,
//         tabBarInactiveTintColor: colors.primary,
//         tabBarLabelStyle: {
//           fontFamily: fonts.publicSans.regular,
//         },
//         headerStyle: { backgroundColor: colors.primary },
//         headerLeft: HeaderLeft,
//         headerRight: HeaderRight,
//         headerTitle: "",
//       }}
//     >
//       <Tab.Screen
//         name={rootNavigationLinks.connections}
//         component={Connections}
//         options={{
//           tabBarIcon: ({ focused }) => <LinkIcon opacity={focused ? 0.5 : 1} />,
//         }}
//       />
//       {/* <Tab.Screen
//         name={rootNavigationLinks.categories}
//         component={Categories}
//         options={{
//           tabBarIcon: ({ focused }) => <DatabaseIcon opacity={focused ? 0.5 : 1} />,
//         }}
//       /> */}
//     </Tab.Navigator>
//   )
// }

const BackButton = () => {
  const navigation = useNavigation()

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <AppButton
      variant="link"
      onPress={handleBack}
      text="Back"
      textStyles={{ fontSize: 17, marginRight: 16 }}
      IconLeft={ChevronLeftIcon}
    />
  )
}

const ConnectionsStack = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.primary)
    }
  }, [])

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={rootNavigationLinks.connectionsItem} component={Connections} />
    </Stack.Navigator>
  )
}

const WelcomeStack = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.warning)
    }
  }, [])

  return (
    <Stack.Navigator screenOptions={{ ...screenOptions }}>
      <Stack.Screen
        options={{ headerShown: false }}
        name={rootNavigationLinks.welcomeItem}
        component={Welcome}
      />
    </Stack.Navigator>
  )
}

export function RootStack() {
  // const isWelcomeViewed = useAtomValue(isWelcomeViewedAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedState)

  // const initialRoute = useMemo(
  //   () => (isWelcomeViewed ? rootNavigationLinks.connections : rootNavigationLinks.welcome),
  //   [isWelcomeViewed],
  // )
  const backButton = () => <BackButton />
  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: true }}>
      {!isAuthenticated && (
        <Stack.Screen
          options={{ headerShown: false }}
          name={rootNavigationLinks.login}
          component={Login}
        />
      )}
      {isAuthenticated && (
        <Fragment>
          <Stack.Screen
            options={{ headerShown: false }}
            name={rootNavigationLinks.dataGenerating}
            component={DataGenerating}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name={rootNavigationLinks.welcome}
            component={WelcomeStack}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name={rootNavigationLinks.connections}
            component={ConnectionsStack}
          />
          {/* <Stack.Screen
            options={{ headerShown: false }}
            name={rootNavigationLinks.home}
            component={TabsStack}
          /> */}
          <Stack.Screen
            options={{ headerLeft: backButton }}
            name={rootNavigationLinks.manageConnection}
            component={ManageConnection}
          />
          <Stack.Screen
            options={{ headerLeft: backButton }}
            name={rootNavigationLinks.manageContact}
            component={ManageContact}
          />
          <Stack.Screen
            options={{ headerLeft: backButton }}
            name={rootNavigationLinks.settings}
            component={Settings}
          />
        </Fragment>
      )}
    </Stack.Navigator>
  )
}
