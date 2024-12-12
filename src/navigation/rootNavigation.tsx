import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useEffect } from "react"
import { StatusBar } from "react-native"
import { DatabaseIcon } from "../components/icons/DatabaseIcon"
import { LinkIcon } from "../components/icons/LinkIcon"
import { Categories } from "../screens/Categories"
import { Connections } from "../screens/Connections"
import { colors } from "../utils/theme"

export const rootNavigationLinks = {
  Home: "Home",
  Connections: "Connections",
  Categories: "Categories",
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
        headerStyle: { backgroundColor: colors.primary },
      }}
    >
      <Tab.Screen
        name={rootNavigationLinks.Connections}
        component={Connections}
        options={{
          tabBarIcon: ({ focused }) => <LinkIcon opacity={focused ? 0.5 : 1} />,
        }}
      />
      <Tab.Screen
        name={rootNavigationLinks.Categories}
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
    <Stack.Navigator
      initialRouteName={rootNavigationLinks.Home}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={rootNavigationLinks.Home} component={TabsStack} />
    </Stack.Navigator>
  )
}
