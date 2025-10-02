import type { UserJoinChatMessage, UserLeaveChatMessage } from '../model/chat-system-message.types'
import type { ChatMessage } from '../model/types'

export const isUserJoinChatMessage = (message: ChatMessage): message is UserJoinChatMessage =>
  'type' in message && message.type === 'user_join_chat'

export const isUserLeaveChatMessage = (message: ChatMessage): message is UserLeaveChatMessage =>
  'type' in message && message.type === 'user_leave_chat'
