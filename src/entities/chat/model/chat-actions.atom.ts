import { atom, type Getter, type Setter } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'

import { sendGroupChatMessage } from '../api/send-group-chat-message'
import { getChatMessagesStateWithDispatchAtom } from './store'
import type { ChatIdentifier, Message } from './types'

type ChatSendMessageAction = {
  type: 'send_message'
  message: Message[]
}

export type ChatAction = ChatSendMessageAction

const handleSendMessage = async (
  _get: Getter,
  set: Setter,
  chatIdentifier: ChatIdentifier,
  action: ChatSendMessageAction,
) => {
  const chatAtom = getChatMessagesStateWithDispatchAtom(chatIdentifier)

  set(chatAtom, { messages: action.message.map((msg) => ({ ...msg, pending: true })), type: 'add_messages' })

  try {
    await sendGroupChatMessage({ groupId: chatIdentifier, message: action.message })

    set(chatAtom, {
      messages: action.message.map((msg) => ({ ...msg, pending: false, sent: true })),
      type: 'update_messages',
    })
  } catch {
    // TODO add error handling
  }
}

export const getChatActionAtom = atomFamily((params: ChatIdentifier) => {
  return atom(null, async (get, set, action: ChatAction) => {
    switch (action.type) {
      case 'send_message': {
        return handleSendMessage(get, set, params, action)
      }
    }
  })
}, isEqual)
