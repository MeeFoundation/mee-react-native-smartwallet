import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeScreen } from "../screens/Home"

export const rootNavigationLinks = {
  Home: "Home",
}

const Stack = createNativeStackNavigator()

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName={rootNavigationLinks.Home}>
      <Stack.Screen name={rootNavigationLinks.Home} component={HomeScreen} />
    </Stack.Navigator>
  )
}
