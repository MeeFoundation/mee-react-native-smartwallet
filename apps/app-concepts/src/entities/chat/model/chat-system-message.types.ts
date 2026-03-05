type BaseSystemMessage = {
  id: string
  createdAt: string
  isSystem: true
  text: string | null
  type: string
}

export type UserJoinChatMessage = BaseSystemMessage & {
  type: 'user_join_chat'
  username: string
}

export type UserLeaveChatMessage = BaseSystemMessage & {
  type: 'user_leave_chat'
  username: string
}

export type SystemMessage = BaseSystemMessage | UserJoinChatMessage | UserLeaveChatMessage
