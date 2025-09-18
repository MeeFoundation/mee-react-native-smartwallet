import { GroupChat } from "@/components/GroupChat"
import { InvalidRouteParamsError } from "@/errors/invalid-route-params.error"
import type { ChatMessage } from "@/models/chat"
import {
  currentUserAtom,
  getChatActionAtom,
  getManagePaginatedChatMessagesListAtom,
  getPaginatedChatMessagesListStateAtom,
} from "@/store/chat"
import { GroupDetails } from "@/store/groups"
import { usePaginatedState } from "@/utils/paginated-list"
import { useLocalSearchParams, type ErrorBoundaryProps } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, type FC } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ErrorBoundary
 * -----------------------------------------------------------------------------------------------*/
// FIXME implements
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupChatScreen
 * -----------------------------------------------------------------------------------------------*/
//  TODO Add loading & error state
const GroupChatScreen: FC = () => {
  const { id } = useLocalSearchParams()
  if (typeof id !== "string") throw new InvalidRouteParamsError()

  const currentChatUser = useAtomValue(currentUserAtom)
  const chatAction = useSetAtom(getChatActionAtom({ groupId: id }))
  const group = useAtomValue(GroupDetails(id))

  const [chatMessagesState] = usePaginatedState(
    { groupId: id },
    getPaginatedChatMessagesListStateAtom,
    getManagePaginatedChatMessagesListAtom,
  )

  const handleSend = useCallback(
    (message: ChatMessage[]) => chatAction({ type: "send_message", message }),
    [chatAction],
  )

  return (
    <SafeAreaView style={styles.safeView}>
      <GroupChat
        group={group}
        currentUser={currentChatUser}
        onSend={handleSend}
        messages={chatMessagesState.data?.items ?? []}
        loading={chatMessagesState.isFetching}
      />
    </SafeAreaView>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupChatScreen
