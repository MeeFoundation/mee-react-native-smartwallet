import TrashIcon from "@assets/images/trash.svg"
import { AppButton } from "@components/AppButton"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useRoute } from "@react-navigation/native"
import { View } from "react-native"

export const ManageConnection = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Manage Connection">>()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AppButton IconRight={TrashIcon} variant="danger" text="Hello" />
    </View>
  )
}
