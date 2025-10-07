import type { SystemMessage, UserJoinChatMessage, UserLeaveChatMessage } from '../model/chat-system-message.types'
import type { Message } from '../model/types'
import type { UserMessage } from '../model/user-chat-message.types'

export const isSystemMessage = (message: Message): message is SystemMessage => 'isSystem' in message && message.isSystem

export const isUserMessage = (message: Message): message is UserMessage => !isSystemMessage(message)

export const isUserJoinChatMessage = (message: Message): message is UserJoinChatMessage =>
  isSystemMessage(message) && message.type === 'user_join_chat'

export const isUserLeaveChatMessage = (message: Message): message is UserLeaveChatMessage =>
  isSystemMessage(message) && message.type === 'user_leave_chat'
