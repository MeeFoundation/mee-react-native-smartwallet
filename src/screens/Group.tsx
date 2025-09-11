import { BackgroundLayout } from "@components/BackgroundLayout"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useRoute } from "@react-navigation/native"
import { GroupDetails } from "@store/index"
import { useAtomValue } from "jotai"
import { FC } from "react"
import { Text } from "react-native"

/* -------------------------------------------------------------------------------------------------
 * GroupScreen
 * -----------------------------------------------------------------------------------------------*/
const GroupScreen: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Group Details">>()
  const groupId = route.params.id

  const group = useAtomValue(GroupDetails(groupId))

  return (
    <>
      <BackgroundLayout />
      {/* TODO implement */}
      {group.status === "archived" && <Text>Archived/Paused</Text>}

      <Text>{group.name}</Text>
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupScreen }
