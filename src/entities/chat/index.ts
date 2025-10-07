// FIXME Remove it
export { mockBobUser, mockKristinUser, mockMeUser } from './api/mock/users'
export { useSubscribeChatEvents } from './lib/subscribe-chat-events'
export {
  isSystemMessage,
  isUserJoinChatMessage,
  isUserLeaveChatMessage,
  isUserMessage,
} from './lib/type-guards'
export { type ChatAction, getChatActionAtom } from './model/chat-actions.atom'
export type { SystemMessage, UserJoinChatMessage, UserLeaveChatMessage } from './model/chat-system-message.types'
export type { User } from './model/chat-user.types'
export {
  ChatNewMessagesEvent,
  ChatStartTypingEvent,
  ChatStopTypingEvent,
  ChatUserJoinChatEvent,
  ChatUserLeaveChatEvent,
} from './model/events'
export { getIsTypingAtom } from './model/is-typing.atom'
export {
  currentUserAtom,
  getChatMessagesStateWithDispatchAtom,
} from './model/store'
export type {
  ChatIdentifier,
  ChatMessagesDispatch,
  ChatMessagesState,
  GetChatMessagesFetchParams,
  Message,
} from './model/types'
export type { Attachment, UserMessage } from './model/user-chat-message.types'
