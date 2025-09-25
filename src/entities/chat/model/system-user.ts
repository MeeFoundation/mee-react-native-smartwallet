import type { ChatUser } from './types'

export const SYSTEM_USER: ChatUser = {
  _id: 'system',
  name: 'System',
} as const
