import { atom, type Getter, type Setter } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual, uniq } from 'lodash-es'

import {
  INITIAL_PAGINATED_STATE,
  makeGetManagePaginatedStateAtom,
  type PaginatedListState,
  type PaginatedStateAtom,
} from '@/shared/lib/paginated-list'
import { generateUUID } from '@/shared/lib/uuid'

import { getGroupChatMessages } from '../api/get-group-chat-messages'
import { mockMeUser } from '../api/mock/users'
import { sendGroupChatMessage } from '../api/send-group-chat-message'
import type { UserJoinChatMessage, UserLeaveChatMessage } from './chat-system-message.types'
import type { ChatUser } from './chat-user.types'
import { SYSTEM_USER } from './system-user'
import type { ChatMessage, GetChatMessagesFetchParams } from './types'

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

type AddNewChatMessagesAtomParams = {
  groupId: string
  messages: ChatMessage[]
}

export const getAddNewChatMessagesAtom = atom(null, async (_get, set, params: AddNewChatMessagesAtomParams) => {
  const chatAtom = getPaginatedChatMessagesListStateAtom({ groupId: params.groupId })
  set(chatAtom, (prev) => addMessages(prev, params.messages))
})

export const getIsTypingAtom = atomFamily((_groupId: string) => atom<string[]>([]))

type ChangeIsTypingParams = {
  groupId: string
  // TODO: probably it must be an id
  usernames: string[]
}

export const addIsTypingAtom = atom(null, async (_get, set, params: ChangeIsTypingParams) => {
  const isTypingAtom = getIsTypingAtom(params.groupId)
  set(isTypingAtom, (prev) => uniq([...prev, ...params.usernames]))
})

export const removeIsTypingAtom = atom(null, async (_get, set, params: ChangeIsTypingParams) => {
  const isTypingAtom = getIsTypingAtom(params.groupId)
  set(isTypingAtom, (prev) => {
    return prev.filter((username) => !params.usernames.includes(username))
  })
})

export const addUserJoinedChatMessageAtom = atom(
  null,
  async (_get, set, params: { groupId: string; username: string }) => {
    set(getPaginatedChatMessagesListStateAtom({ groupId: params.groupId }), (prev) =>
      addMessages(prev, [
        {
          _id: generateUUID(),
          createdAt: new Date(),
          system: true,
          text: '',
          type: 'user_join_chat',
          user: SYSTEM_USER,
          username: params.username,
        } satisfies UserJoinChatMessage,
      ]),
    )
  },
)

export const addUserLeaveChatMessageAtom = atom(
  null,
  async (_get, set, params: { groupId: string; username: string }) => {
    set(getPaginatedChatMessagesListStateAtom({ groupId: params.groupId }), (prev) =>
      addMessages(prev, [
        {
          _id: generateUUID(),
          createdAt: new Date(),
          system: true,
          text: '',
          type: 'user_leave_chat',
          user: SYSTEM_USER,
          username: params.username,
        } satisfies UserLeaveChatMessage,
      ]),
    )
  },
)
