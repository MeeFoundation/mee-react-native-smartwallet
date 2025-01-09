import { Drawer } from "@components/Drawer"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { RootStack } from "./src/navigation/rootNavigation"

export default function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <Drawer>
          <RootStack />
        </Drawer>
      </GestureHandlerRootView>
    </NavigationContainer>
  )
}
