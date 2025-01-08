import { PortalProvider } from "@components/Portal"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { RootStack } from "./src/navigation/rootNavigation"

export default function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <PortalProvider>
          <RootStack />
        </PortalProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  )
}
