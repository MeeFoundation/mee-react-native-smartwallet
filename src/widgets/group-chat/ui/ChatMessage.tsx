import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Avatar, type MessageProps as GiftedMessageProps } from 'react-native-gifted-chat'

import type { ChatMessage as ChatMessageType } from '@/entities/chat'

import { cn } from '@/shared/lib/cn'
import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'

import { ChatBubble } from './ChatBubble'

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
