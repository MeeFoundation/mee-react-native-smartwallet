import type { ImagePickerAsset } from 'expo-image-picker'

import type { IconSymbolName } from '@/shared/ui/IconSymbol'

export const resolveAttachmentIcon = (attachment: ImagePickerAsset): IconSymbolName => {
  if (attachment.type === 'image') return 'photo.outlined'
  if (attachment.type === 'video') return 'play-circle.outlined'
  return 'document.outlined'
}
