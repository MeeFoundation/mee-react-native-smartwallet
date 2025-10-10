import type { User } from './chat-user.types'

export type AttachmentType = 'image' | 'video' | 'file'
export const isAttachmentType = (type: string): type is AttachmentType =>
  type === 'image' || type === 'video' || type === 'file'

export type Attachment = {
  id: string
  type: AttachmentType
  url: string
  fileSize: number // in bytes
  fileName: string
}

export type UserMessage = {
  id: string
  replyTo?: UserMessage
  text: string
  user: User
  createdAt: string
  pending?: boolean
  sent?: boolean
  attachments?: Attachment[]
}
