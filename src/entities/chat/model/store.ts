import { atom, type Getter, type SetStateAction, type Setter, type WritableAtom } from 'jotai'
import { atomFamily, atomWithDefault } from 'jotai/utils'

import { assertUnreachable } from '@/shared/lib/assert-unreachable'

import { getChatMessagesApi } from '../api/get-chat-messages.api'
import { mockMeUser } from '../api/mock/users'
import type { User } from './chat-user.types'
import type { ChatIdentifier, ChatMessagesAction, ChatMessagesState, Message } from './types'

export const currentUserAtom = atom<User>(mockMeUser)

const MESSSAGES_PAGE_SIZE = 12

const INITIAL_MESSAGES_STATE: ChatMessagesState = {
  hasEarlierMessages: true,
  hasNewerMessages: true,
  isLoaded: false,
  isLoading: false,
  isLoadingEarlier: false,
  isLoadingNewer: false,
  messages: [],
} as const

type ChatMessagesStateAtom = WritableAtom<ChatMessagesState, [SetStateAction<ChatMessagesState>], void>

const getChatMessagesStateAtom = atomFamily(
  (_identifier: ChatIdentifier): ChatMessagesStateAtom =>
    atomWithDefault<ChatMessagesState>(() => INITIAL_MESSAGES_STATE),
)

const handleReset = async (get: Getter, set: Setter, messagesStateAtom: ChatMessagesStateAtom) => {
  set(messagesStateAtom, (prev) => ({ ...prev, isLoading: true }))

  const response = await getChatMessagesApi({
    groupId: '',
    limit: MESSSAGES_PAGE_SIZE,
  })

  const newState: ChatMessagesState = {
    ...get(messagesStateAtom),
    hasEarlierMessages: !!response.hasEarlierMessages,
    hasNewerMessages: !!response.hasNewerMessages,
    isLoaded: true,
    isLoading: false,
    messages: response.messages,
  }

  set(messagesStateAtom, newState)

  return newState
}

const handleClear = async (_get: Getter, set: Setter, messagesStateAtom: ChatMessagesStateAtom) => {
  set(messagesStateAtom, INITIAL_MESSAGES_STATE)
  return INITIAL_MESSAGES_STATE
}

const handleLoadEarlierMessages = async (get: Getter, set: Setter, messagesStateAtom: ChatMessagesStateAtom) => {
  set(messagesStateAtom, (prev) => ({ ...prev, isLoadingEarlier: true }))
  const currentState = get(messagesStateAtom)

  const response = await getChatMessagesApi({
    beforeId: currentState.messages.at(-1)?.id,
    groupId: '',
    limit: MESSSAGES_PAGE_SIZE,
  })

  const newState: ChatMessagesState = {
    ...get(messagesStateAtom),
    hasEarlierMessages: !!response.hasEarlierMessages,
    isLoadingEarlier: false,
    messages: [...currentState.messages, ...response.messages],
  }

  set(messagesStateAtom, newState)

  return newState
}

const handleLoadNewerMessages = async (get: Getter, set: Setter, messagesStateAtom: ChatMessagesStateAtom) => {
  set(messagesStateAtom, (prev) => ({ ...prev, isLoadingNewer: true }))
  const currentState = get(messagesStateAtom)

  const response = await getChatMessagesApi({
    afterId: currentState.messages.at(0)?.id,
    groupId: '',
    limit: MESSSAGES_PAGE_SIZE,
  })

  const newState: ChatMessagesState = {
    ...get(messagesStateAtom),
    hasNewerMessages: !!response.hasNewerMessages,
    isLoadingNewer: false,
    messages: [...response.messages, ...currentState.messages],
  }

  set(messagesStateAtom, newState)

  return newState
}

const handleLoadAroundAnchor = async (
  get: Getter,
  set: Setter,
  messagesStateAtom: ChatMessagesStateAtom,
  anchorId: string,
) => {
  set(messagesStateAtom, { ...INITIAL_MESSAGES_STATE, isLoading: true })

  const response = await getChatMessagesApi({
    anchorId,
    groupId: '',
    limit: MESSSAGES_PAGE_SIZE * 2,
  })

  const newState: ChatMessagesState = {
    ...get(messagesStateAtom),
    hasEarlierMessages: !!response.hasEarlierMessages,
    hasNewerMessages: !!response.hasNewerMessages,
    isLoaded: true,
    isLoading: false,
    messages: response.messages,
  }

  set(messagesStateAtom, newState)

  return newState
}

const handleAddMessages = async (
  get: Getter,
  set: Setter,
  messagesStateAtom: ChatMessagesStateAtom,
  messages: Message[],
) => {
  const currentState = get(messagesStateAtom)

  const newState: ChatMessagesState = {
    ...get(messagesStateAtom),
    messages: [...messages, ...currentState.messages],
  }

  set(messagesStateAtom, newState)

  return newState
}

const handleUpdateMessages = async (
  get: Getter,
  set: Setter,
  messagesStateAtom: ChatMessagesStateAtom,
  messages: Array<Message>,
) => {
  const currentState = get(messagesStateAtom)

  const newState: ChatMessagesState = {
    ...get(messagesStateAtom),
    messages: currentState.messages.map((message) => {
      const updatedMessage = messages.find((m) => m.id === message.id)
      return updatedMessage ?? message
    }),
  }

  set(messagesStateAtom, newState)

  return newState
}

export const getChatMessagesStateWithDispatchAtom = atomFamily((identifier: ChatIdentifier) => {
  const messagesStateAtom = getChatMessagesStateAtom(identifier)

  return atom(
    (get) => get(messagesStateAtom),
    async (get, set, action: ChatMessagesAction): Promise<ChatMessagesState> => {
      switch (action.type) {
        case 'reset':
          return handleReset(get, set, messagesStateAtom)

        case 'clear':
          return handleClear(get, set, messagesStateAtom)

        case 'load_earlier_messages':
          return handleLoadEarlierMessages(get, set, messagesStateAtom)

        case 'load_newer_messages':
          return handleLoadNewerMessages(get, set, messagesStateAtom)

        case 'load_around_anchor':
          return handleLoadAroundAnchor(get, set, messagesStateAtom, action.anchorId)

        case 'add_messages':
          return handleAddMessages(get, set, messagesStateAtom, action.messages)

        case 'update_messages':
          return handleUpdateMessages(get, set, messagesStateAtom, action.messages)

        default:
          assertUnreachable(action)
          return get(messagesStateAtom)
      }
    },
  )
})
