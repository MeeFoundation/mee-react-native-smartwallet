import { useNavigation } from "@react-navigation/native"
import { Button, View } from "react-native"

// const navigation = useNavigation<NavigationProp<RootStackParamList>>()

export function Categories() {
  const navigation = useNavigation()

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Old York Time"
        onPress={() => navigation.navigate("Manage Connection", { id: "1" })}
      />
    </View>
  )
}
