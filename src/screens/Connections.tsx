import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { Text, View } from "react-native"

export function Connections() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ headerRight: () => <Text>Header Right</Text> })
  }, [navigation])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Connections</Text>
    </View>
  )
}
