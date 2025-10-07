import { type ErrorBoundaryProps, useLocalSearchParams } from 'expo-router'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { type FC, useCallback, useEffect } from 'react'
import { Text, View } from 'react-native'

import { Chat } from '@/widgets/chat'
import { GroupScreenHeader, GroupScreenTabs } from '@/widgets/group-screen-header'
import { ScreenLayout } from '@/widgets/navigation'

import {
  currentUserAtom,
  getChatActionAtom,
  getChatMessagesStateWithDispatchAtom,
  getIsTypingAtom,
  type Message,
  useSubscribeChatEvents,
} from '@/entities/chat'
import { getGroupAtom, useGroupView } from '@/entities/group'

import { InvalidRouteParamsError } from '@/shared/errors'

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

  const [messagesState, dispatch] = useAtom(getChatMessagesStateWithDispatchAtom(id))

  useEffect(() => {
    if (!messagesState.isLoaded && !messagesState.isLoading) dispatch({ type: 'reset' })
  }, [messagesState.isLoaded, messagesState.isLoading, dispatch])

  // TODO fixme
  const typingUsers = useAtomValue(getIsTypingAtom(id))
  const currentChatUser = useAtomValue(currentUserAtom)

  const chatAction = useSetAtom(getChatActionAtom(id))
  const group = useAtomValue(getGroupAtom(id))
  const groupView = useGroupView(group)

  const handleSend = useCallback((message: Message[]) => chatAction({ message, type: 'send_message' }), [chatAction])
  const handleLoadEarlier = useCallback(() => dispatch({ type: 'load_earlier_messages' }), [dispatch])
  const handleLoadNewer = useCallback(() => dispatch({ type: 'load_newer_messages' }), [dispatch])

  const onRefresh = useCallback(() => dispatch({ type: 'reset' }), [dispatch])

  const handleLoadMessagesAroundAnchor = useCallback(
    (anchorId: string) => dispatch({ anchorId, type: 'load_around_anchor' }),
    [dispatch],
  )

  // FIXME remove
  useEffect(() => {
    return () => {
      dispatch({ type: 'clear' })
    }
  }, [dispatch])
  useSubscribeChatEvents(id)

  return (
    <ScreenLayout.Root>
      <GroupScreenHeader group={groupView} />

      <GroupScreenTabs group={groupView} />

      <ScreenLayout.Content scrollable={false}>
        <Chat
          chatIdentifier={id}
          currentUser={currentChatUser}
          onLoadEarlier={handleLoadEarlier}
          onLoadNewer={handleLoadNewer}
          onRefresh={onRefresh}
          onRepliedToPress={handleLoadMessagesAroundAnchor}
          onSend={handleSend}
          // TODO check refresh
          state={messagesState}
          typingUsers={typingUsers}
        />
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupChatScreen
