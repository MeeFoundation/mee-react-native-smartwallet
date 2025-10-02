import { BusEvent } from '@/shared/lib/event-bus'

import type { ChatUser } from './chat-user.types'
import type { ChatMessage } from './types'

export class ChatNewMessagesEvent extends BusEvent {
  name = 'chat_new_messages'

  constructor(
    public readonly groupId: string,
    public readonly messages: ChatMessage[],
  ) {
    super()
  }
}

export class ChatStartTypingEvent extends BusEvent {
  name = 'chat_start_typing'

  constructor(
    public readonly groupId: string,
    public readonly users: ChatUser[],
  ) {
    super()
  }
}

export class ChatStopTypingEvent extends BusEvent {
  name = 'chat_stop_typing'

  constructor(
    public readonly groupId: string,
    public readonly users: ChatUser[],
  ) {
    super()
  }
}

export class ChatUserJoinChatEvent extends BusEvent {
  name = 'chat_user_join_chat'

  constructor(
    public readonly groupId: string,
    public readonly user: ChatUser,
  ) {
    super()
  }
}

export class ChatUserLeaveChatEvent extends BusEvent {
  name = 'chat_user_leave_chat'

  constructor(
    public readonly groupId: string,
    public readonly user: ChatUser,
  ) {
    super()
  }
}
