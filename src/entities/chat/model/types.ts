import type { PaginatedFetchParams, PaginatedListResponse } from '@/shared/model'

import type { SystemMessage } from './chat-system-message.types'
import type { UserChatMessage } from './user-chat-message.types'

export type ChatMessage = UserChatMessage | SystemMessage

export type GetChatMessagesFetchParams = {
  groupId: string
}

export type GetChatMessagesPaginatedListFetchParams = PaginatedFetchParams & GetChatMessagesFetchParams

export type GetChatMessagesPaginatedListResponse = PaginatedListResponse<ChatMessage>

export type SendChatMessageFetchParams = {
  groupId: string
  message: ChatMessage[]
}
