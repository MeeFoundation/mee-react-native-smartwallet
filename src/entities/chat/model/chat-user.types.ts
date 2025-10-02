import type { User } from 'react-native-gifted-chat'
import type { O } from 'ts-toolbelt'

/**
 * This is a user for chat
 * User in chat is releated to connection but they are not the same
 */
export type ChatUser = O.Required<User, 'name'>
