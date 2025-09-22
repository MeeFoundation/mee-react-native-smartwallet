import type { IChatMessage, User } from 'react-native-gifted-chat'

import type { PaginatedFetchParams, PaginatedListResponse } from '@/shared/model'

export type ChatUser = User
export type ChatMessage = IChatMessage

export type GetChatMessagesFetchParams = {
  groupId: string
}

export type GetChatMessagesPaginatedListFetchParams = PaginatedFetchParams & GetChatMessagesFetchParams

export type GetChatMessagesPaginatedListResponse = PaginatedListResponse<ChatMessage>
