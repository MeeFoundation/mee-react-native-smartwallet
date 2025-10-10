import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { eventBus } from '@/shared/lib/event-bus'

import {
  ChatNewMessagesEvent,
  ChatStartTypingEvent,
  ChatStopTypingEvent,
  ChatUserJoinChatEvent,
  ChatUserLeaveChatEvent,
} from '../model/events'
import { addIsTypingAtom, removeIsTypingAtom } from '../model/is-typing.atom'
import { addUserJoinedChatMessageAtom, addUserLeaveChatMessageAtom } from '../model/join-left-chat.atom'
import { getChatMessagesStateWithDispatchAtom } from '../model/store'
import type { ChatIdentifier } from '../model/types'

export const useSubscribeChatEvents = (chatIdentifier: ChatIdentifier) => {
  const dispatch = useSetAtom(getChatMessagesStateWithDispatchAtom(chatIdentifier))
  const addIsTyping = useSetAtom(addIsTypingAtom)
  const removeIsTyping = useSetAtom(removeIsTypingAtom)
  const addUserJoinedChatMessage = useSetAtom(addUserJoinedChatMessageAtom)
  const addUserLeaveChatMessage = useSetAtom(addUserLeaveChatMessageAtom)

  useEffect(() => {
    const unsubscribeNewMessages = eventBus.subscribe(ChatNewMessagesEvent, (event) => {
      dispatch({ messages: event.messages, type: 'add_messages' })
    })

    const unsubscribeStartTyping = eventBus.subscribe(ChatStartTypingEvent, (event) => {
      addIsTyping({
        chatIdentifier,
        usernames: event.users.map((user) => user.name).filter((name) => name !== undefined),
      })
    })

    const unsubscribeStopTyping = eventBus.subscribe(ChatStopTypingEvent, (event) => {
      removeIsTyping({
        chatIdentifier,
        usernames: event.users.map((user) => user.name).filter((name) => name !== undefined),
      })
    })

    const unsubscribeUserJoinChat = eventBus.subscribe(ChatUserJoinChatEvent, (event) => {
      addUserJoinedChatMessage({ chatIdentifier, username: event.user.name })
    })

    const unsubscribeUserLeaveChat = eventBus.subscribe(ChatUserLeaveChatEvent, (event) => {
      addUserLeaveChatMessage({ chatIdentifier, username: event.user.name })
    })

    return () => {
      unsubscribeNewMessages()
      unsubscribeStartTyping()
      unsubscribeStopTyping()
      unsubscribeUserJoinChat()
      unsubscribeUserLeaveChat()
    }
  }, [dispatch, addIsTyping, chatIdentifier, removeIsTyping, addUserJoinedChatMessage, addUserLeaveChatMessage])
}
