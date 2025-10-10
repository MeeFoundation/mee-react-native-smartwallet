import { atom } from 'jotai'

import { generateUUID } from '@/shared/lib/uuid'

import type { UserJoinChatMessage, UserLeaveChatMessage } from './chat-system-message.types'
import { getChatMessagesStateWithDispatchAtom } from './store'
import type { ChatIdentifier } from './types'

export const addUserJoinedChatMessageAtom = atom(
  null,
  async (_get, set, params: { chatIdentifier: ChatIdentifier; username: string }) => {
    set(getChatMessagesStateWithDispatchAtom(params.chatIdentifier), {
      messages: [
        {
          createdAt: new Date().toISOString(),
          id: generateUUID(),
          isSystem: true,
          text: '',
          type: 'user_join_chat',
          username: params.username,
        } satisfies UserJoinChatMessage,
      ],
      type: 'add_messages',
    })
  },
)

export const addUserLeaveChatMessageAtom = atom(
  null,
  async (_get, set, params: { chatIdentifier: ChatIdentifier; username: string }) => {
    set(getChatMessagesStateWithDispatchAtom(params.chatIdentifier), {
      messages: [
        {
          createdAt: new Date().toISOString(),
          id: generateUUID(),
          isSystem: true,
          text: '',
          type: 'user_leave_chat',
          username: params.username,
        } satisfies UserLeaveChatMessage,
      ],
      type: 'add_messages',
    })
  },
)
