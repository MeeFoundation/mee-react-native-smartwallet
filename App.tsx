import { Drawer } from "@components/Drawer"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { RootStack } from "./src/navigation/rootNavigation"

export default function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Drawer>
            <RootStack />
          </Drawer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  )
}
