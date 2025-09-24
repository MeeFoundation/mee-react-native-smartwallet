import { atom, type Getter, type SetStateAction, type Setter, type WritableAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'

import { DEFAULT_PAGE_SIZE } from '@/shared/config'
import { AppError, UnknownError } from '@/shared/errors'
import { INITIAL_PAGINATED_STATE, type PaginatedListState, type PaginationAction } from '@/shared/lib/paginated-list'

import { getGroupChatMessages } from '../api/get-group-chat-messages'
import { mockMeUser } from '../api/mock/chat'
import { sendGroupChatMessage } from '../api/send-group-chat-message'
import type {
  ChatMessage,
  ChatUser,
  GetChatMessagesFetchParams,
  GetChatMessagesPaginatedListFetchParams,
  GetChatMessagesPaginatedListResponse,
} from './types'

export const currentUserAtom = atom<ChatUser>(mockMeUser)

type PaginatedChatMessagesListState = PaginatedListState<ChatMessage>

export const getPaginatedChatMessagesListStateAtom = atomFamily<
  GetChatMessagesFetchParams,
  WritableAtom<PaginatedChatMessagesListState, [SetStateAction<PaginatedChatMessagesListState>], void>
>((_params: GetChatMessagesFetchParams) => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedChatMessagesListAtom = atomFamily((params: GetChatMessagesFetchParams) => {
  const chatMessagesDataAtom = getPaginatedChatMessagesListStateAtom(params)

  return atom(null, async (get, set, action: PaginationAction) => {
    const currentState = get(chatMessagesDataAtom)

    const fetchParams: GetChatMessagesPaginatedListFetchParams = {
      ...params,
      limit: DEFAULT_PAGE_SIZE,
      startIndex: 0,
    }

    if (action === 'loadMore') {
      /**
       * If there is no next index, there is no more data to load
       */
      if (!currentState.data?.nextIndex) return
      fetchParams.startIndex = currentState.data.nextIndex
    }

    /**
     * Refresh sets the start index to 0
     */
    if (action === 'refresh') fetchParams.startIndex = 0

    /**
     * Reset sets the start index to 0
     */
    if (action === 'reset') fetchParams.startIndex = 0

    set(chatMessagesDataAtom, (prev) => ({
      ...prev,
      isFetching: true,
      isFetchingNextPage: action === 'loadMore',
      isRefreshing: action === 'refresh' || action === 'reset',
    }))

    try {
      const result = await getGroupChatMessages(fetchParams)

      set(chatMessagesDataAtom, (prev) => {
        /**
         * Only load more adds data to the list
         */
        const newData: GetChatMessagesPaginatedListResponse =
          action === 'loadMore' && prev.data ? { ...result, items: [...prev.data.items, ...result.items] } : result

        return {
          ...prev,
          data: newData,
          error: null,
          hasNextPage: result.nextIndex !== null,
          isFetched: true,
          isFetching: false,
          isFetchingNextPage: false,
          isRefreshing: false,
        } satisfies PaginatedChatMessagesListState
      })
    } catch (error) {
      set(chatMessagesDataAtom, (prev) => ({
        ...prev,
        error: error instanceof AppError ? error : new UnknownError(),
        isFetched: true,
        isFetching: false,
        isFetchingNextPage: false,
        isRefreshing: false,
      }))
    }
  })
}, isEqual)

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
