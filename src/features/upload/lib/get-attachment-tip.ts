import type { ImagePickerAsset } from 'expo-image-picker'

import { formatBytes } from '@/shared/lib/format-bytes'

export const getAttachmentExtensionText = (attachment: ImagePickerAsset): string | null => {
  const str = attachment.fileName ?? attachment.uri.split('?').at(0)
  const extension = str?.split('.').pop()
  return extension?.toLowerCase() ?? null
}

export const getAttachmenSizeText = (attachment: ImagePickerAsset): string | null =>
  !attachment.fileSize ? null : formatBytes(attachment.fileSize, 1)

export const getAttachmentTip = (attachment: ImagePickerAsset): string =>
  [getAttachmenSizeText(attachment), getAttachmentExtensionText(attachment)].filter(Boolean).join(' • ')
