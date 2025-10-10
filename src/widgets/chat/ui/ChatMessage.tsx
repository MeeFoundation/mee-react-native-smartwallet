import type { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import {
  isSystemMessage,
  isUserJoinChatMessage,
  isUserLeaveChatMessage,
  isUserMessage,
  type Message,
  type SystemMessage,
  type UserMessage,
} from '@/entities/chat'

import { isSameDate } from '@/shared/lib/date-time'
import { cn } from '@/shared/lib/styling'
import { Avatar } from '@/shared/ui/Avatar'
import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'

import { ChatBubble } from './ChatBubble'
import { ChatDate } from './ChatDate'

/* -------------------------------------------------------------------------------------------------
 * SystemChatMessageContent
 * -----------------------------------------------------------------------------------------------*/
type SystemChatMessageContentProps = { message: SystemMessage }

const SystemChatMessageContent: FC<SystemChatMessageContentProps> = ({ message }) => {
  if (isUserJoinChatMessage(message)) {
    return (
      <Typography className="text-gray-900/65 text-xs">
        <Trans
          components={{ em: <Typography className="font-semibold text-primary text-xs" /> }}
          i18nKey="{{name}} joined chat"
          ns="chat"
          values={{ name: message.username }}
        />
      </Typography>
    )
  }

  if (isUserLeaveChatMessage(message)) {
    return (
      <Typography className="text-gray-900/65 text-xs">
        <Trans
          components={{ em: <Typography className="font-semibold text-primary text-xs" /> }}
          i18nKey="{{name}} left chat"
          ns="chat"
          values={{ name: message.username }}
        />
      </Typography>
    )
  }

  return <Typography className="text-gray-900/65 text-xs">{message.text}</Typography>
}

/* -------------------------------------------------------------------------------------------------
 * SystemChatMessage
 * -----------------------------------------------------------------------------------------------*/
type SystemChatMessageProps = { message: SystemMessage }

const SystemChatMessage: FC<SystemChatMessageProps> = (props) => (
  <View className="my-4.5 items-center">
    <View className="rounded-md border border-black/7 bg-white/90 px-2.5 py-1">
      <SystemChatMessageContent {...props} />
    </View>
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ChatMessageStatus
 * -----------------------------------------------------------------------------------------------*/
type ChatMessageStatusProps = { message: UserMessage }

const ChatMessageStatus: FC<ChatMessageStatusProps> = (props) => {
  const { t: chatT } = useTranslation('chat')

  return (
    <View className="h-6 flex-1 items-end pt-1">
      {props.message.pending ? (
        <View className="h-4 w-4">
          <Spinner />
        </View>
      ) : props.message.sent ? (
        <Typography className="text-gray-900 text-xs opacity-65">{chatT('message_status.sent')}</Typography>
      ) : null}
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * UserChatMessage
 * -----------------------------------------------------------------------------------------------*/
type UserChatMessageProps = {
  message: UserMessage
  previousMessage: UserMessage | null
  nextMessage: UserMessage | null
  position: 'left' | 'right'
}

const UserChatMessage: FC<UserChatMessageProps> = (props) => {
  const isSameNextMessage = props.previousMessage?.user?.id === props.message.user?.id
  const sameDate = !props.previousMessage
    ? false
    : isSameDate(props.previousMessage?.createdAt, props.message.createdAt)

  return (
    <>
      {sameDate ? null : <ChatDate date={props.message.createdAt} />}
      <View className={cn('basis-px flex-row gap-1.5', isSameNextMessage ? 'mt-0.5' : 'mt-2')}>
        {props.position === 'left' && props.previousMessage?.user?.id !== props.message.user?.id ? (
          <Avatar size={36} src={props.message.user.avatar || undefined} text={props.message.user.name} />
        ) : (
          <View className="size-9" />
        )}

        <View className="flex-1">
          <ChatBubble className="flex-1" message={props.message} position={props.position} />
          {props.position === 'left' || !!props.nextMessage?.id ? null : <ChatMessageStatus message={props.message} />}
        </View>
      </View>
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatMessage
 * -----------------------------------------------------------------------------------------------*/
type ChatMessageProps = {
  message: Message
  previousMessage: Message | null
  nextMessage: Message | null
  position: 'left' | 'right'
}

const ChatMessage: FC<ChatMessageProps> = (props) => {
  if (isSystemMessage(props.message)) return <SystemChatMessage message={props.message} />

  const nextMessage = props.nextMessage && isUserMessage(props.nextMessage) ? props.nextMessage : null
  const previousMessage = props.previousMessage && isUserMessage(props.previousMessage) ? props.previousMessage : null

  return (
    <UserChatMessage
      message={props.message}
      nextMessage={nextMessage}
      position={props.position}
      previousMessage={previousMessage}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatMessage }

export type { ChatMessageProps }
