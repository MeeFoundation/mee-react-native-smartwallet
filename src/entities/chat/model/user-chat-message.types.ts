import type { User } from './chat-user.types'

export type Attachment = {
  id: string
  type: 'image' | 'video' | 'file'
  url: string
  fileSize: number // in bytes
  fileName: string
}

export type UserMessage = {
  id: string
  text: string
  user: User
  createdAt: string
  pending?: boolean
  sent?: boolean
  attachments?: Attachment[]
}
