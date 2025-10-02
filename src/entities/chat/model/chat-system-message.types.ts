import type { IChatMessage } from 'react-native-gifted-chat'

export type UserJoinChatMessage = IChatMessage & {
  system: true
  type: 'user_join_chat'
  username: string
}

export type UserLeaveChatMessage = IChatMessage & {
  system: true
  type: 'user_leave_chat'
  username: string
}

export type SystemMessage = UserJoinChatMessage | UserLeaveChatMessage
