import { type ErrorBoundaryProps, useLocalSearchParams } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { type FC, useCallback, useMemo } from 'react'
import { Text, View } from 'react-native'

import { GroupChat } from '@/widgets/group-chat'
import { GroupScreenHeader, GroupScreenTabs } from '@/widgets/group-screen-header'
import { ScreenLayout } from '@/widgets/navigation'

import {
  type ChatMessage,
  currentUserAtom,
  type GetChatMessagesFetchParams,
  getChatActionAtom,
  getIsTypingAtom,
  getManagePaginatedChatMessagesListAtom,
  getPaginatedChatMessagesListStateAtom,
  useSubscribeChatEvents,
} from '@/entities/chat'
import { getGroupAtom, useGroupView } from '@/entities/group'

import { InvalidRouteParamsError } from '@/shared/errors'
import { usePaginatedState } from '@/shared/lib/paginated-list'

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

  const typingUsers = useAtomValue(getIsTypingAtom(id))
  const currentChatUser = useAtomValue(currentUserAtom)
  const messagesFetchParams: GetChatMessagesFetchParams = useMemo(() => ({ groupId: id }), [id])

  const chatAction = useSetAtom(getChatActionAtom(messagesFetchParams))
  const group = useAtomValue(getGroupAtom(id))
  const groupView = useGroupView(group)

  const [chatMessagesState, manageChatMessagesState] = usePaginatedState(
    { groupId: id },
    getPaginatedChatMessagesListStateAtom,
    getManagePaginatedChatMessagesListAtom,
  )

  const handleSend = useCallback(
    (message: ChatMessage[]) => chatAction({ message, type: 'send_message' }),
    [chatAction],
  )

  const handleLoadEarlier = useCallback(() => manageChatMessagesState('loadMore'), [manageChatMessagesState])
  const onRefresh = useCallback(() => manageChatMessagesState('refresh'), [manageChatMessagesState])

  useSubscribeChatEvents(id)

  return (
    <ScreenLayout.Root>
      <GroupScreenHeader group={groupView} />

      <GroupScreenTabs group={groupView} />

      <ScreenLayout.Content className="px-3" safeBottomInset scrollable={false}>
        <GroupChat
          allLoaded={chatMessagesState.data?.nextIndex === null}
          currentUser={currentChatUser}
          group={group}
          isLoadingEarlier={chatMessagesState.isFetchingNextPage}
          loading={!chatMessagesState.isFetched}
          messages={chatMessagesState.data?.items ?? []}
          onLoadEarlier={handleLoadEarlier}
          onRefresh={onRefresh}
          onSend={handleSend}
          refreshing={chatMessagesState.isRefreshing}
          typingUsers={typingUsers}
        />
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupChatScreen
