// FIXME Remove it
export { mockBobUser, mockKristinUser, mockMeUser } from './api/mock/users'
export { useSubscribeChatEvents } from './lib/subscribe-chat-events'
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
export type { ChatMessage, ChatUser, GetChatMessagesFetchParams } from './model/types'
export { isUserJoinChatMessage, isUserLeaveChatMessage } from './model/types'
