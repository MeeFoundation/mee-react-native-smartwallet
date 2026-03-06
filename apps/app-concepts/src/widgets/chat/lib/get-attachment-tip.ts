import type { Attachment } from '@/entities/chat'

import { formatBytes } from '@/shared/lib/format-bytes'

export const getAttachmentExtensionText = (attachment: Attachment): string | null => {
  const str = attachment.fileName ?? attachment.url.split('?').at(0)
  const extension = str?.split('.').pop()
  return extension?.toLowerCase() ?? null
}

export const getAttachmenSizeText = (attachment: Attachment): string | null =>
  !attachment.fileSize ? null : formatBytes(attachment.fileSize, 1)

export const getAttachmentTip = (attachment: Attachment): string =>
  [getAttachmenSizeText(attachment), getAttachmentExtensionText(attachment)].filter(Boolean).join(' • ')
