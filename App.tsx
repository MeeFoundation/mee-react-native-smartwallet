import React from "react"
import { SafeAreaView, StatusBar, useColorScheme } from "react-native"

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark"

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        // backgroundColor={backgroundStyle.backgroundColor}
      />
    </SafeAreaView>
  )
}

export default App
