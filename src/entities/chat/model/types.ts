import type { IChatMessage, User } from 'react-native-gifted-chat'

import type { PaginatedFetchParams, PaginatedListResponse } from '@/shared/model'

export type ChatUser = User & {
  name: string
}

export type UserJoinChatMessage = IChatMessage & {
  system: true
  type: 'user_join_chat'
  username: string
}

export const isUserJoinChatMessage = (message: ChatMessage): message is UserJoinChatMessage =>
  'type' in message && message.type === 'user_join_chat'

export type UserLeaveChatMessage = IChatMessage & {
  system: true
  type: 'user_leave_chat'
  username: string
}

export const isUserLeaveChatMessage = (message: ChatMessage): message is UserLeaveChatMessage =>
  'type' in message && message.type === 'user_leave_chat'

export type ChatMessage = IChatMessage | UserJoinChatMessage | UserLeaveChatMessage

export type GetChatMessagesFetchParams = {
  groupId: string
}

export type GetChatMessagesPaginatedListFetchParams = PaginatedFetchParams & GetChatMessagesFetchParams

export type GetChatMessagesPaginatedListResponse = PaginatedListResponse<ChatMessage>

export type SendChatMessageFetchParams = {
  groupId: string
  message: ChatMessage[]
}
