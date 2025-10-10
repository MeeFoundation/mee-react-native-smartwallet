import type { PaginatedFetchParams, PaginatedListResponse } from '@/shared/model'

import type { SystemMessage } from './chat-system-message.types'
import type { UserMessage } from './user-chat-message.types'

export type Message = UserMessage | SystemMessage

export type GetChatMessagesFetchParams = {
  groupId: string
  anchorId?: string
}

export type GetChatMessagesPaginatedListFetchParams = PaginatedFetchParams & GetChatMessagesFetchParams

export type GetChatMessagesPaginatedListResponse = PaginatedListResponse<Message>

export type SendChatMessageFetchParams = {
  groupId: string
  message: Message[]
}

export type ChatIdentifier = string

export type ChatMessagesState = {
  isLoaded: boolean
  isLoading: boolean
  isLoadingEarlier: boolean
  isLoadingNewer: boolean
  hasNewerMessages: boolean
  hasEarlierMessages: boolean
  messages: Message[]
}

export type ChatMessagesAction =
  | { type: 'reset' }
  | { type: 'load_earlier_messages' }
  | { type: 'load_newer_messages' }
  | { type: 'clear' }
  | { type: 'load_around_anchor'; anchorId: string }
  | { type: 'add_messages'; messages: Message[] }
  | { type: 'update_messages'; messages: Array<Message> }

export type ChatMessagesDispatch = (action: ChatMessagesAction) => Promise<ChatMessagesState>
