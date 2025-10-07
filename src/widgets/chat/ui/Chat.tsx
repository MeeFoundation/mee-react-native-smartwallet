import type BottomSheet from '@gorhom/bottom-sheet'
import { FlashList, type FlashListRef, type ListRenderItem } from '@shopify/flash-list'
import { type FC, useCallback, useMemo, useRef } from 'react'

import { UploadProvider } from '@/features/upload'

import { type ChatIdentifier, isUserMessage, type Message, type User } from '@/entities/chat'

import { useLoadEarlierMessages } from '../lib/use-load-earlier-messages'
import { useLoadNewerMessages } from '../lib/use-load-newer-messages'
import { ActionsBackdrop } from './ActionsBackdrop'
import { ChatLoading } from './ChatLoading'
import { ChatMessage as ChatMessageComponent } from './ChatMessage'
import { ChatMessagesLoading } from './ChatMessagesLoading'
import { ChatToolbar } from './ChatToolbar'

/* -------------------------------------------------------------------------------------------------
 *  Chat
 * -----------------------------------------------------------------------------------------------*/
type ChatProps = {
  chatIdentifier: ChatIdentifier
  currentUser: User
  messages: Message[]
  loading?: boolean
  typingUsers?: string[]

  onSend: (message: Message[]) => void

  isLoadingEarlier?: boolean
  onLoadEarlier?: () => Promise<void>
  isAllEarlierLoaded?: boolean

  isLoadingNewer?: boolean
  onLoadNewer?: () => Promise<void>
  isAllNewerLoaded?: boolean

  refreshing?: boolean
  onRefresh?: () => void

  onRepliedToPress?: (messageId: string) => void
}

const Chat: FC<ChatProps> = (props) => {
  const listRef = useRef<FlashListRef<Message>>(null)
  const scrollLockedRef = useRef(false)
  const actionsSheetRef = useRef<BottomSheet>(null)

  const messages = useMemo(() => [...props.messages].reverse(), [props.messages])

  const handleActionsButtonPress = useCallback(() => {
    actionsSheetRef.current?.expand()
  }, [])

  const loadEarlierMessages = useLoadEarlierMessages({
    hasEarlierMessages: !props.isAllEarlierLoaded,
    isLoadingEarlier: !!props.isLoadingEarlier,
    listRef,
    loadEarlierMessages: props.onLoadEarlier,
    messages: props.messages,
    scrollLockedRef,
  })

  const loadNewerMessages = useLoadNewerMessages({
    hasNewerMessages: !props.isAllNewerLoaded,
    isLoadingNewer: !!props.isLoadingNewer,
    listRef,
    loadNewerMessages: props.onLoadNewer,
    scrollLockedRef,
  })
  // const handleForwardedPress = useGoToMessage(dispatch, ref, scrollLockedRef)

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

  return props.loading ? (
    <ChatLoading />
  ) : (
    <UploadProvider assetsGroupIdentifier={props.chatIdentifier}>
      <FlashList
        data={messages}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<ChatMessagesLoading isLoading={!!props.isLoadingEarlier} />}
        ListHeaderComponent={<ChatMessagesLoading isLoading={!!props.isLoadingEarlier} />}
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
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Chat }

export type { ChatProps }
