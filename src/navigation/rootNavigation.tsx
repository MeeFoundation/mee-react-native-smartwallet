import DatabaseIcon from "@assets/images/database.svg"
import LinkIcon from "@assets/images/link.svg"
import { HeaderLeft, HeaderRight } from "@components/Header"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Categories } from "@screens/Categories"
import { Connections } from "@screens/Connections"
import { ManageConnection } from "@screens/ManageConnection"
import { colors, fonts } from "@utils/theme"
import { useEffect } from "react"
import { StatusBar } from "react-native"

export type RootStackParamList = {
  "Manage Connection": { id: string }
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const rootNavigationLinks = {
  home: "Home",
  connections: "Connections",
  categories: "Categories",
  manageConnection: "Manage Connection",
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabsStack = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor(colors.primary)
  }, [])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActiveColor,
        tabBarInactiveTintColor: colors.primary,
        tabBarLabelStyle: {
          fontFamily: fonts.publicSans.regular,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerLeft: HeaderLeft,
        headerRight: HeaderRight,
        headerTitle: "",
      }}
    >
      <Tab.Screen
        name={rootNavigationLinks.connections}
        component={Connections}
        options={{
          tabBarIcon: ({ focused }) => <LinkIcon opacity={focused ? 0.5 : 1} />,
        }}
      />
      <Tab.Screen
        name={rootNavigationLinks.categories}
        component={Categories}
        options={{
          tabBarIcon: ({ focused }) => <DatabaseIcon opacity={focused ? 0.5 : 1} />,
        }}
      />
    </Tab.Navigator>
  )
}

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName={rootNavigationLinks.home}>
      <Stack.Screen
        options={{ headerShown: false }}
        name={rootNavigationLinks.home}
        component={TabsStack}
      />
      <Stack.Screen name={rootNavigationLinks.manageConnection} component={ManageConnection} />
    </Stack.Navigator>
  )
}
