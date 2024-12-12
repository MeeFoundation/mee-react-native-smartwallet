import { Text, View } from "react-native"
import { colors } from "../utils/theme"

export function Categories() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.primary }}>Categories</Text>
    </View>
  )
}
