import { NavigationContainer } from "@react-navigation/native"
import { RootStack } from "./src/navigation/rootNavigation"

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  )
}
