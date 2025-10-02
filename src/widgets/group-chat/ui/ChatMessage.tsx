import type { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Avatar, type MessageProps as GiftedMessageProps } from 'react-native-gifted-chat'

import { type ChatMessage as ChatMessageType, isUserJoinChatMessage, isUserLeaveChatMessage } from '@/entities/chat'

import { cn } from '@/shared/lib/styling'
import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'

import { ChatBubble } from './ChatBubble'

/* -------------------------------------------------------------------------------------------------
 * SystemChatMessageContent
 * -----------------------------------------------------------------------------------------------*/
type SystemChatMessageContentProps = GiftedMessageProps<ChatMessageType>

const SystemChatMessageContent: FC<SystemChatMessageContentProps> = ({ currentMessage }) => {
  if (isUserJoinChatMessage(currentMessage)) {
    return (
      <Typography className="text-gray-900/65 text-xs">
        <Trans
          components={{ em: <Typography className="font-semibold text-primary text-xs" /> }}
          i18nKey="{{name}} joined chat"
          ns="chat"
          values={{ name: currentMessage.username }}
        />
      </Typography>
    )
  }

  if (isUserLeaveChatMessage(currentMessage)) {
    return (
      <Typography className="text-gray-900/65 text-xs">
        <Trans
          components={{ em: <Typography className="font-semibold text-primary text-xs" /> }}
          i18nKey="{{name}} left chat"
          ns="chat"
          values={{ name: currentMessage.username }}
        />
      </Typography>
    )
  }

  return <Typography className="text-gray-900/65 text-xs">{currentMessage.text}</Typography>
}

/* -------------------------------------------------------------------------------------------------
 * SystemChatMessage
 * -----------------------------------------------------------------------------------------------*/
type SystemChatMessageProps = GiftedMessageProps<ChatMessageType>

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
type ChatMessageStatusProps = GiftedMessageProps<ChatMessageType>

const ChatMessageStatus: FC<ChatMessageStatusProps> = (props) => {
  const { t: chatT } = useTranslation('chat')

  return (
    <View className="h-6 flex-1 items-end pt-1">
      {props.currentMessage.pending ? (
        <View className="h-4 w-4">
          <Spinner />
        </View>
      ) : props.currentMessage.sent ? (
        <Typography className="text-gray-900 text-xs opacity-65">{chatT('message_status.sent')}</Typography>
      ) : null}
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatMessage
 * -----------------------------------------------------------------------------------------------*/
type ChatMessageProps = GiftedMessageProps<ChatMessageType>

const ChatMessage: FC<ChatMessageProps> = (props) => {
  const isSameNextMessage = props.previousMessage?.user?._id === props.currentMessage.user?._id

  if (props.currentMessage.system) return <SystemChatMessage {...props} />

  return (
    <View className={cn('basis-px flex-row', isSameNextMessage ? 'mt-0.5' : 'mt-2')}>
      {props.position === 'left' && <Avatar {...props} />}

      <View className="flex-1">
        <ChatBubble {...props} className="flex-1" />
        {props.position === 'left' || !!props.nextMessage?._id ? null : <ChatMessageStatus {...props} />}
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatMessage }

export type { ChatMessageProps }
