import { createContext, useContext } from 'react'

import type { Attachment } from '@/entities/chat'

export type ChatContext = {
  attachments: Attachment[]
  setAttachments: (attachments: Attachment[]) => void
  addAttachments: (attachments: Attachment[]) => void
  removeAttachment: (attachmentId: string) => void
  replyToMessageId: string | undefined
  setReplyToMessageId: (messageId: string | undefined) => void
  onRepliedToPress: ((messageId: string) => void) | undefined
}

export const ChatProvider = createContext<ChatContext>({
  addAttachments: () => {},
  attachments: [],
  onRepliedToPress: () => {},
  removeAttachment: () => {},
  replyToMessageId: undefined,
  setAttachments: () => {},
  setReplyToMessageId: () => {},
})

export const useChatContext = () => useContext(ChatProvider)
