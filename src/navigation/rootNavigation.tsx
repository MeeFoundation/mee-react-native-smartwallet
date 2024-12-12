import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Categories } from "../screens/Categories"
import { Connections } from "../screens/Connections"

export const rootNavigationLinks = {
  Home: "Home",
  Connections: "Connections",
  Categories: "Categories",
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={rootNavigationLinks.Connections} component={Connections} />
      <Tab.Screen name={rootNavigationLinks.Categories} component={Categories} />
    </Tab.Navigator>
  )
}

export function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName={rootNavigationLinks.Home}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={rootNavigationLinks.Home} component={HomeTabs} />
    </Stack.Navigator>
  )
}
