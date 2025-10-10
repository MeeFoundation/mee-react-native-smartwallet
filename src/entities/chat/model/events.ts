import { BusEvent } from '@/shared/lib/event-bus'

import type { User } from './chat-user.types'
import type { ChatIdentifier, Message } from './types'

export class ChatNewMessagesEvent extends BusEvent {
  name = 'chat_new_messages'

  constructor(
    public readonly chatIdentifier: ChatIdentifier,
    public readonly messages: Message[],
  ) {
    super()
  }
}

export class ChatStartTypingEvent extends BusEvent {
  name = 'chat_start_typing'

  constructor(
    public readonly chatIdentifier: ChatIdentifier,
    public readonly users: User[],
  ) {
    super()
  }
}

export class ChatStopTypingEvent extends BusEvent {
  name = 'chat_stop_typing'

  constructor(
    public readonly chatIdentifier: ChatIdentifier,
    public readonly users: User[],
  ) {
    super()
  }
}

export class ChatUserJoinChatEvent extends BusEvent {
  name = 'chat_user_join_chat'

  constructor(
    public readonly chatIdentifier: ChatIdentifier,
    public readonly user: User,
  ) {
    super()
  }
}

export class ChatUserLeaveChatEvent extends BusEvent {
  name = 'chat_user_leave_chat'

  constructor(
    public readonly chatIdentifier: ChatIdentifier,
    public readonly user: User,
  ) {
    super()
  }
}
