import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"

export const Connections = () => {
  const navigation = useNavigation()

  useEffect(() => {
    // navigation.setOptions({ headerRight: () => <Text>Header Right</Text> })
  }, [navigation])

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Connections</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    fontFamily: "Cochin",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
