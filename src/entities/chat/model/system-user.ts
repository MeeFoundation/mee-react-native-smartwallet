import type { ChatUser } from './chat-user.types'

export const SYSTEM_USER: ChatUser = {
  _id: 'system',
  name: 'System',
} as const
