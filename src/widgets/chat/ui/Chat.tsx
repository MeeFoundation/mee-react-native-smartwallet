import type BottomSheet from '@gorhom/bottom-sheet'
import { FlashList, type FlashListRef, type ListRenderItem } from '@shopify/flash-list'
import { type FC, useCallback, useMemo, useRef, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import {
  type Attachment,
  type ChatIdentifier,
  type ChatMessagesState,
  isUserMessage,
  type Message,
  type User,
} from '@/entities/chat'

import { generateUUID } from '@/shared/lib/uuid'

import { useLoadEarlierMessages } from '../lib/use-load-earlier-messages'
import { useLoadNewerMessages } from '../lib/use-load-newer-messages'
import { ActionsBackdrop } from './ActionsBackdrop'
import { ChatLoading } from './ChatLoading'
import { ChatMessage as ChatMessageComponent } from './ChatMessage'
import { ChatMessagesLoading } from './ChatMessagesLoading'
import { type ChatContext, ChatProvider } from './ChatProvider'
import { ChatToolbar } from './ChatToolbar'
import { ChatTypingIndicator } from './ChatTytpingIndicator'

/* -------------------------------------------------------------------------------------------------
 *  Chat
 * -----------------------------------------------------------------------------------------------*/
type ChatProps = {
  state: ChatMessagesState
  chatIdentifier: ChatIdentifier
  currentUser: User
  typingUsers?: string[]

  onRefresh?: () => Promise<ChatMessagesState>
  onSend: (message: Message[]) => void
  onLoadEarlier?: () => Promise<ChatMessagesState>
  onLoadNewer?: () => Promise<ChatMessagesState>
  onRepliedToPress?: (messageId: string) => Promise<ChatMessagesState>
}

const Chat: FC<ChatProps> = (props) => {
  const listRef = useRef<FlashListRef<Message>>(null)
  const scrollLockedRef = useRef(false)
  const actionsSheetRef = useRef<BottomSheet>(null)
  const [replyToMessageId, setReplyToMessageId] = useState<string | undefined>(undefined)
  const [attachments, setAttachments] = useState<Attachment[]>([])

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

  const refresh = useCallback(() => {
    if (!props.onRefresh || props.state.isLoading || props.state.hasNewerMessages) return
    props.onRefresh()
  }, [props.onRefresh, props.state.isLoading, props.state.hasNewerMessages])

  const handleOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const conentHeight = listRef.current?.getWindowSize()?.height
      const needRefresh = !conentHeight
        ? false
        : conentHeight + event.nativeEvent.contentOffset.y - event.nativeEvent.contentSize.height > 50

      if (needRefresh) refresh()

      scrollLockedRef.current = false
    },
    [refresh],
  )

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

  const replyToMessage = useMemo(() => {
    const founded = messages.find((message) => message.id === replyToMessageId)
    return founded && isUserMessage(founded) ? founded : undefined
  }, [messages, replyToMessageId])

  const handleSend = useCallback(
    (text: string) => {
      const messages: Message[] = [
        {
          attachments,
          createdAt: new Date().toISOString(),
          id: generateUUID(),
          replyTo: replyToMessage,
          text,
          user: props.currentUser,
        },
      ]

      props.onSend(messages)

      listRef.current?.scrollToEnd({ animated: true })
      setAttachments([])
      setReplyToMessageId(undefined)
    },
    [props.onSend, props.currentUser, attachments, replyToMessage],
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

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId))
  }, [])

  const addAttachments = useCallback((attachments: Attachment[]) => {
    setAttachments((prev) => [...prev, ...attachments])
  }, [])

  const chatProviderValue: ChatContext = useMemo(
    () => ({
      addAttachments,
      attachments,
      onRepliedToPress,
      removeAttachment,
      replyToMessageId,
      setAttachments,
      setReplyToMessageId,
    }),
    [onRepliedToPress, replyToMessageId, attachments, removeAttachment, addAttachments],
  )

  const listFooter =
    props.state.isLoading || props.state.isLoadingNewer ? (
      <ChatMessagesLoading isLoading />
    ) : props.typingUsers?.length ? (
      <ChatTypingIndicator typingUsers={props.typingUsers} />
    ) : null

  const listHeader = <ChatMessagesLoading isLoading={props.state.isLoadingEarlier} />

  return !props.state.isLoaded ? (
    <ChatLoading />
  ) : (
    <ChatProvider value={chatProviderValue}>
      <FlashList
        className="px-2"
        data={messages}
        keyExtractor={(item) => item.id}
        ListFooterComponent={listFooter}
        ListHeaderComponent={listHeader}
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
        refreshing={props.state.isLoading}
        renderItem={renderItem}
      />

      <ChatToolbar messages={messages} onSend={handleSend} onToggleActions={handleActionsButtonPress} />

      <ActionsBackdrop ref={actionsSheetRef} />
    </ChatProvider>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Chat }

export type { ChatProps }
