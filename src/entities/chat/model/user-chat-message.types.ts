import type { ImagePickerAsset } from 'expo-image-picker'
import type { IChatMessage } from 'react-native-gifted-chat'

export type UserChatMessageAttachment = ImagePickerAsset

export type UserChatMessage = IChatMessage & {
  attachments?: UserChatMessageAttachment[]
}
