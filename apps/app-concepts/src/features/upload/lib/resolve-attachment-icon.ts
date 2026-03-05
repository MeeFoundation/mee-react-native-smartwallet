import type { IconSymbolName } from '@/shared/ui/IconSymbol'

// TODO add support for file extension
export const resolveAttachmentIcon = (_url: string, attachmentType: string | null): IconSymbolName => {
  if (attachmentType === 'image') return 'photo.outlined'
  if (attachmentType === 'video') return 'play-circle.outlined'
  return 'document.outlined'
}
