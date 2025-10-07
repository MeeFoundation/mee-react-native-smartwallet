import type BottomSheet from '@gorhom/bottom-sheet'
import { FlashList, type FlashListRef, type ListRenderItem } from '@shopify/flash-list'
import { type FC, useCallback, useMemo, useRef } from 'react'

import { UploadProvider } from '@/features/upload'

import { type ChatIdentifier, type ChatMessagesState, isUserMessage, type Message, type User } from '@/entities/chat'

import { useLoadEarlierMessages } from '../lib/use-load-earlier-messages'
import { useLoadNewerMessages } from '../lib/use-load-newer-messages'
import { ActionsBackdrop } from './ActionsBackdrop'
import { ChatLoading } from './ChatLoading'
import { ChatMessage as ChatMessageComponent } from './ChatMessage'
import { ChatMessagesLoading } from './ChatMessagesLoading'
import { type ChatContext, ChatProvider } from './ChatProvider'
import { ChatToolbar } from './ChatToolbar'

/* -------------------------------------------------------------------------------------------------
 *  Chat
 * -----------------------------------------------------------------------------------------------*/
type ChatProps = {
  state: ChatMessagesState
  chatIdentifier: ChatIdentifier
  currentUser: User
  typingUsers?: string[]

  onRefresh?: () => void
  onSend: (message: Message[]) => void
  onLoadEarlier?: () => Promise<ChatMessagesState>
  onLoadNewer?: () => Promise<ChatMessagesState>
  onRepliedToPress?: (messageId: string) => Promise<ChatMessagesState>
}

const Chat: FC<ChatProps> = (props) => {
  const listRef = useRef<FlashListRef<Message>>(null)
  const scrollLockedRef = useRef(false)
  const actionsSheetRef = useRef<BottomSheet>(null)

  const messages = useMemo(() => [...props.state.messages].reverse(), [props.state.messages])

  const handleActionsButtonPress = useCallback(() => {
    actionsSheetRef.current?.expand()
  }, [])

  const loadEarlierMessages = useLoadEarlierMessages({
    listRef,
    loadEarlierMessages: props.onLoadEarlier,
    scrollLockedRef,
    state: props.state,
  })

  const loadNewerMessages = useLoadNewerMessages({
    listRef,
    loadNewerMessages: props.onLoadNewer,
    scrollLockedRef,
    state: props.state,
  })

  const handleOnScroll = useCallback(() => {
    scrollLockedRef.current = false
  }, [])

  const renderItem: ListRenderItem<Message> = useCallback(
    ({ item, index }) => (
      <ChatMessageComponent
        message={item}
        nextMessage={messages[index + 1] ?? null}
        position={isUserMessage(item) && item.user.id === props.currentUser.id ? 'right' : 'left'}
        previousMessage={messages[index - 1] ?? null}
      />
    ),
    [messages, props.currentUser.id],
  )

  const handleSend = useCallback(
    (text: string) => {
      const messages: Message[] = [{ createdAt: new Date().toISOString(), id: '1', text, user: props.currentUser }]
      props.onSend(messages)
      listRef.current?.scrollToEnd({ animated: true })
    },
    [props.onSend, props.currentUser],
  )

  const onRepliedToPress = useCallback(
    async (messageId: string) => {
      const newState = await props.onRepliedToPress?.(messageId)

      const messageToScrollTo = newState?.messages.find((message) => message.id === messageId)

      scrollLockedRef.current = true

      if (messageToScrollTo) {
        setTimeout(() => {
          listRef.current?.scrollToItem({ animated: true, item: messageToScrollTo, viewPosition: 0.5 })
        })
      }
    },
    [props.onRepliedToPress],
  )

  const chatProviderValue: ChatContext = useMemo(() => ({ onRepliedToPress }), [onRepliedToPress])

  return !props.state.isLoaded ? (
    <ChatLoading />
  ) : (
    <ChatProvider value={chatProviderValue}>
      <UploadProvider assetsGroupIdentifier={props.chatIdentifier}>
        <FlashList
          data={messages}
          keyExtractor={(item) => item.id}
          ListFooterComponent={<ChatMessagesLoading isLoading={props.state.isLoadingNewer} />}
          ListHeaderComponent={<ChatMessagesLoading isLoading={props.state.isLoadingEarlier} />}
          maintainVisibleContentPosition={{
            autoscrollToBottomThreshold: 0.1,
            startRenderingFromBottom: true,
          }}
          onEndReached={loadNewerMessages}
          onEndReachedThreshold={0.1}
          onScroll={handleOnScroll}
          onStartReached={loadEarlierMessages}
          onStartReachedThreshold={0.1}
          ref={listRef}
          renderItem={renderItem}
        />

        <ChatToolbar onSend={handleSend} onToggleActions={handleActionsButtonPress} />

        <ActionsBackdrop ref={actionsSheetRef} />
      </UploadProvider>
    </ChatProvider>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Chat }

export type { ChatProps }
