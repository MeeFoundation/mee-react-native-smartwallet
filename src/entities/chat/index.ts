// FIXME Remove it
export { mockBobUser, mockKristinUser, mockMeUser } from './api/mock/users'
export { useSubscribeChatEvents } from './lib/subscribe-chat-events'
export { isUserJoinChatMessage, isUserLeaveChatMessage } from './lib/type-guards'
export type { ChatUser } from './model/chat-user.types'
export {
  ChatNewMessagesEvent,
  ChatStartTypingEvent,
  ChatStopTypingEvent,
  ChatUserJoinChatEvent,
  ChatUserLeaveChatEvent,
} from './model/events'
export {
  currentUserAtom,
  getChatActionAtom,
  getIsTypingAtom,
  getManagePaginatedChatMessagesListAtom,
  getPaginatedChatMessagesListStateAtom,
} from './model/store'
export type { ChatMessage, GetChatMessagesFetchParams } from './model/types'
export type { UserChatMessage, UserChatMessageAttachment } from './model/user-chat-message.types'
