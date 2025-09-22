import { DEFAULT_PAGE_SIZE } from "@/shared/config"
import { AppError, UnknownError } from "@/shared/errors"
import type {
  ChatMessage,
  ChatUser,
  GetChatMessagesFetchParams,
  GetChatMessagesPaginatedListFetchParams,
  GetChatMessagesPaginatedListResponse,
} from "./types"

import {
  INITIAL_PAGINATED_STATE,
  type PaginatedListState,
  type PaginationAction,
} from "@/shared/lib/paginated-list"
import { atom, type SetStateAction, type WritableAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { isEqual } from "lodash-es"
import { mockKristinUser, mockMeUser } from "./mock/chat"
import { chatService } from "./service"

export const currentUserAtom = atom<ChatUser>(mockMeUser)

type PaginatedChatMessagesListState = PaginatedListState<ChatMessage>

export const getPaginatedChatMessagesListStateAtom = atomFamily<
  GetChatMessagesFetchParams,
  WritableAtom<
    PaginatedChatMessagesListState,
    [SetStateAction<PaginatedChatMessagesListState>],
    void
  >
>((_params: GetChatMessagesFetchParams) => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedChatMessagesListAtom = atomFamily(
  (params: GetChatMessagesFetchParams) => {
    const personsDataAtom = getPaginatedChatMessagesListStateAtom(params)

    return atom(null, async (get, set, action: PaginationAction) => {
      const currentState = get(personsDataAtom)

      const fetchParams: GetChatMessagesPaginatedListFetchParams = {
        ...params,
        startIndex: 0,
        limit: DEFAULT_PAGE_SIZE,
      }

      if (action === "loadMore") {
        /**
         * If there is no next index, there is no more data to load
         */
        if (!currentState.data?.nextIndex) return
        fetchParams.startIndex = currentState.data.nextIndex
      }

      /**
       * Refresh sets the start index to 0
       */
      if (action === "refresh") fetchParams.startIndex = 0

      /**
       * Reset sets the start index to 0
       */
      if (action === "reset") fetchParams.startIndex = 0

      set(personsDataAtom, (prev) => ({
        ...prev,
        isRefreshing: action === "refresh" || action === "reset",
        isFetching: true,
        isFetchingNextPage: action === "loadMore",
      }))

      try {
        const result = await chatService.getGroupMessages(fetchParams)

        set(personsDataAtom, (prev) => {
          /**
           * Only load more adds data to the list
           */
          const newData: GetChatMessagesPaginatedListResponse =
            action === "loadMore" && prev.data
              ? { ...result, items: [...prev.data.items, ...result.items] }
              : result

          return {
            ...prev,
            data: newData,
            hasNextPage: result.nextIndex !== null,
            isRefreshing: false,
            isFetchingNextPage: false,
            isFetched: true,
            isFetching: false,
            error: null,
          } satisfies PaginatedChatMessagesListState
        })
      } catch (error) {
        set(personsDataAtom, (prev) => ({
          ...prev,
          isRefreshing: false,
          isFetchingNextPage: false,
          isFetched: true,
          isFetching: false,
          error: error instanceof AppError ? error : new UnknownError(),
        }))
      }
    })
  },
  isEqual,
)

type ChatSendMessageAction = {
  type: "send_message"
  message: ChatMessage[]
}

type ChatAction = ChatSendMessageAction

export const getChatActionAtom = atomFamily((params: GetChatMessagesFetchParams) => {
  const chatAtom = getPaginatedChatMessagesListStateAtom(params)

  return atom(null, async (_get, set, action: ChatAction) => {
    switch (action.type) {
      case "send_message": {
        set(chatAtom, (prev) => {
          if (!prev.data) throw new Error(`Chat for group ${params.groupId} not found`)

          // FIXME Remove the mock
          const mockedMessages = (msg: ChatMessage): ChatMessage =>
            msg.text.startsWith("/resp")
              ? { ...msg, text: msg.text.replace("/resp", ""), user: mockKristinUser }
              : msg

          const newState: PaginatedChatMessagesListState = {
            ...prev,
            data: {
              ...prev.data,
              items: [...action.message.map(mockedMessages), ...(prev.data?.items ?? [])],
            },
          }

          return newState
        })
        await chatService.sendMessage(params.groupId, action.message)
        break
      }
    }
  })
}, isEqual)
