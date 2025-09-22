import { type ErrorBoundaryProps, useLocalSearchParams } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { type FC, useCallback } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { GroupChat } from '@/widgets/group-chat'

import {
  type ChatMessage,
  currentUserAtom,
  getChatActionAtom,
  getManagePaginatedChatMessagesListAtom,
  getPaginatedChatMessagesListStateAtom,
} from '@/entities/chat'
import { getGroupAtom } from '@/entities/group'

import { InvalidRouteParamsError } from '@/shared/errors'
import { usePaginatedState } from '@/shared/lib/paginated-list'

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
    <View style={{ backgroundColor: 'red', flex: 1 }}>
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
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const currentChatUser = useAtomValue(currentUserAtom)
  const chatAction = useSetAtom(getChatActionAtom({ groupId: id }))
  const group = useAtomValue(getGroupAtom(id))

  const [chatMessagesState] = usePaginatedState(
    { groupId: id },
    getPaginatedChatMessagesListStateAtom,
    getManagePaginatedChatMessagesListAtom,
  )

  const handleSend = useCallback(
    (message: ChatMessage[]) => chatAction({ message, type: 'send_message' }),
    [chatAction],
  )

  return (
    <SafeAreaView style={styles.safeView}>
      <GroupChat
        currentUser={currentChatUser}
        group={group}
        loading={chatMessagesState.isFetching}
        messages={chatMessagesState.data?.items ?? []}
        onSend={handleSend}
      />
    </SafeAreaView>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupChatScreen
