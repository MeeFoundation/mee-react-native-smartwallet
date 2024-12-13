import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { View } from "react-native"
import { RootStackParamList } from "../navigation/rootNavigation"

type Props = NativeStackScreenProps<RootStackParamList, "Manage Connection">

export const ManageConnection = (props: Props) => {
  const id = props.route.params.id

  return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}></View>
}
