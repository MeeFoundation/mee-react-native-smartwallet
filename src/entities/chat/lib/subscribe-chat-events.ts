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
import {
  addIsTypingAtom,
  addUserJoinedChatMessageAtom,
  addUserLeaveChatMessageAtom,
  getAddNewChatMessagesAtom,
  removeIsTypingAtom,
} from '../model/store'

export const useSubscribeChatEvents = (groupId: string) => {
  const addNewChatMessagesAtom = useSetAtom(getAddNewChatMessagesAtom)
  const addIsTyping = useSetAtom(addIsTypingAtom)
  const removeIsTyping = useSetAtom(removeIsTypingAtom)
  const addUserJoinedChatMessage = useSetAtom(addUserJoinedChatMessageAtom)
  const addUserLeaveChatMessage = useSetAtom(addUserLeaveChatMessageAtom)

  useEffect(() => {
    const unsubscribeNewMessages = eventBus.subscribe(ChatNewMessagesEvent, (event) => {
      addNewChatMessagesAtom({ groupId, messages: event.messages })
    })

    const unsubscribeStartTyping = eventBus.subscribe(ChatStartTypingEvent, (event) => {
      addIsTyping({ groupId, usernames: event.users.map((user) => user.name).filter((name) => name !== undefined) })
    })

    const unsubscribeStopTyping = eventBus.subscribe(ChatStopTypingEvent, (event) => {
      removeIsTyping({ groupId, usernames: event.users.map((user) => user.name).filter((name) => name !== undefined) })
    })

    const unsubscribeUserJoinChat = eventBus.subscribe(ChatUserJoinChatEvent, (event) => {
      addUserJoinedChatMessage({ groupId, username: event.user.name })
    })

    const unsubscribeUserLeaveChat = eventBus.subscribe(ChatUserLeaveChatEvent, (event) => {
      addUserLeaveChatMessage({ groupId, username: event.user.name })
    })

    return () => {
      unsubscribeNewMessages()
      unsubscribeStartTyping()
      unsubscribeStopTyping()
      unsubscribeUserJoinChat()
      unsubscribeUserLeaveChat()
    }
  }, [addNewChatMessagesAtom, addIsTyping, groupId, removeIsTyping, addUserJoinedChatMessage, addUserLeaveChatMessage])
}
