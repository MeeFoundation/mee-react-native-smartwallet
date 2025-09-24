import { atom, type Getter, type Setter } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'

import {
  INITIAL_PAGINATED_STATE,
  makeGetManagePaginatedStateAtom,
  type PaginatedListState,
  type PaginatedStateAtom,
} from '@/shared/lib/paginated-list'

import { getGroupChatMessages } from '../api/get-group-chat-messages'
import { mockMeUser } from '../api/mock/chat'
import { sendGroupChatMessage } from '../api/send-group-chat-message'
import type { ChatMessage, ChatUser, GetChatMessagesFetchParams } from './types'

export const currentUserAtom = atom<ChatUser>(mockMeUser)

type PaginatedChatMessagesListState = PaginatedListState<ChatMessage>

export const getPaginatedChatMessagesListStateAtom = atomFamily<
  GetChatMessagesFetchParams,
  PaginatedStateAtom<ChatMessage>
>(() => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedChatMessagesListAtom = makeGetManagePaginatedStateAtom(
  getPaginatedChatMessagesListStateAtom,
  getGroupChatMessages,
)

type ChatSendMessageAction = {
  type: 'send_message'
  message: ChatMessage[]
}

type ChatAction = ChatSendMessageAction

const addMessages = (state: PaginatedChatMessagesListState, messages: ChatMessage[]): PaginatedChatMessagesListState =>
  !state.data ? state : { ...state, data: { ...state.data, items: [...messages, ...(state.data?.items ?? [])] } }

const updateMessages = (
  state: PaginatedChatMessagesListState,
  update: (message: ChatMessage) => ChatMessage,
): PaginatedChatMessagesListState =>
  !state.data ? state : { ...state, data: { ...state.data, items: state.data.items.map(update) } }

const handleSendMessage = async (
  _get: Getter,
  set: Setter,
  chatParams: GetChatMessagesFetchParams,
  action: ChatSendMessageAction,
) => {
  const chatAtom = getPaginatedChatMessagesListStateAtom(chatParams)
  const ids = action.message.map((msg) => msg._id)

  set(chatAtom, (prev) => {
    const messagesWithPending = action.message.map((msg) => ({ ...msg, pending: true }))
    return addMessages(prev, messagesWithPending)
  })

  try {
    await sendGroupChatMessage({ groupId: chatParams.groupId, message: action.message })

    set(chatAtom, (prev) =>
      updateMessages(prev, (msg) => (ids.includes(msg._id) ? { ...msg, pending: false, sent: true } : msg)),
    )
  } catch {
    // TODO add error handling
  }
}

export const getChatActionAtom = atomFamily((params: GetChatMessagesFetchParams) => {
  return atom(null, async (get, set, action: ChatAction) => {
    switch (action.type) {
      case 'send_message': {
        return handleSendMessage(get, set, params, action)
      }
    }
  })
}, isEqual)
