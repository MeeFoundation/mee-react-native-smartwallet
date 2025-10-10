import { type FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { type Attachment, isUserMessage, type Message, type UserMessage } from '@/entities/chat'

import { cn } from '@/shared/lib/styling'
import { IconButton } from '@/shared/ui/IconButton'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { TextInput } from '@/shared/ui/TextInput'
import { Typography } from '@/shared/ui/Typography'

import * as ChatAttachment from './ChatAttachement'
import { useChatContext } from './ChatProvider'

type AttachmentsProps = {
  attachments: Attachment[]
  removeAttachment: (uri: string) => void
}

const Attachments: FC<AttachmentsProps> = ({ attachments, removeAttachment }) => (
  <View className="gap-1">
    {attachments.map((attachment, index) => (
      <ChatAttachment.Root key={`${attachment.id}-${index}`}>
        <ChatAttachment.Icon />
        <ChatAttachment.Content name={attachment.fileName ?? attachment.url} />
        <ChatAttachment.Action name="x-mark.outlined" onPress={() => removeAttachment(attachment.url)} />
      </ChatAttachment.Root>
    ))}
  </View>
)

/* -------------------------------------------------------------------------------------------------
 *  ReplyToMessage
 * -----------------------------------------------------------------------------------------------*/
type ReplyToMessageProps = {
  message: UserMessage
}

const ReplyToMessage: FC<ReplyToMessageProps> = ({ message }) => {
  const { setReplyToMessageId } = useChatContext()

  const handleClearReplyToMessage = useCallback(() => {
    setReplyToMessageId(undefined)
  }, [setReplyToMessageId])

  return (
    <View className="flex-row px-2">
      <View style={{ flex: 1 }}>
        <Typography className="font-semibold text-gray-900 text-xs">{message.user?.name}</Typography>
        <Typography className="text-gray-900 text-xs" numberOfLines={2}>
          {message.text}
        </Typography>
      </View>
      <View>
        <IconButton icon="x-mark.outlined" onPress={handleClearReplyToMessage} />
      </View>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 *  SendButton
 * -----------------------------------------------------------------------------------------------*/
type SendButtonProps = {
  disabled?: boolean
  onPress: () => void
}

const SendButton: FC<SendButtonProps> = (props) => (
  <TouchableOpacity className="size-10 items-center justify-center" disabled={props.disabled} onPress={props.onPress}>
    <View
      className={cn(
        'size-6.5 items-center justify-center rounded-full py-[5px] ps-1.5 pe-1',
        props.disabled ? 'bg-black/10' : 'bg-primary',
      )}
    >
      <IconSymbol className="text-white" height={14} name="paper-airplane.filled" width={14} />
    </View>
  </TouchableOpacity>
)

/* -------------------------------------------------------------------------------------------------
 *  ChatToolbar
 * -----------------------------------------------------------------------------------------------*/
type ChatToolbarProps = {
  disabled?: boolean
  onSend?: (message: string) => void
  onToggleActions?: () => void
  messages?: Message[]
}

const ChatToolbar: FC<ChatToolbarProps> = (props) => {
  const insets = useSafeAreaInsets()
  const { t: chatT } = useTranslation('chat')
  const { replyToMessageId, attachments, removeAttachment } = useChatContext()
  const [value, setValue] = useState('')

  const replyToMessage = useMemo(() => {
    const founded = props.messages?.find((message) => message.id === replyToMessageId)
    return founded && isUserMessage(founded) ? founded : undefined
  }, [props.messages, replyToMessageId])

  const handleSend = useCallback(() => {
    props.onSend?.(value)
    setValue('')
  }, [props.onSend, value])

  const hasAdditionalContent = !!replyToMessage || !!attachments.length

  return (
    <View
      className={cn('mt-2 gap-1 p-2', hasAdditionalContent && 'bg-gray-100')}
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {!replyToMessage ? null : <ReplyToMessage message={replyToMessage} />}
      {!attachments.length ? null : <Attachments attachments={attachments} removeAttachment={removeAttachment} />}

      <View className="h-12 flex-row items-center">
        <View className="size-10 items-center justify-center">
          <IconButton disabled={props.disabled} icon="plus.outlined" onPress={props.onToggleActions} />
        </View>

        <View style={{ flex: 1 }}>
          <TextInput onChangeText={setValue} placeholder={chatT('input.placeholder')} size="sm" value={value} />
        </View>

        <View className="size-10 items-center justify-center">
          <SendButton disabled={props.disabled} onPress={handleSend} />
        </View>
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatToolbar }

export type { ChatToolbarProps }
