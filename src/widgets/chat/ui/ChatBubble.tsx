import { type FC, useCallback, useMemo } from 'react'
import { Linking, Share, View } from 'react-native'
import { type BubbleProps, useChatContext } from 'react-native-gifted-chat'
import ParsedText, { type ParseShape } from 'react-native-parsed-text'

import { getAttachmentTip, resolveAttachmentIcon } from '@/features/upload'

import type { ChatMessage, UserChatMessageAttachment } from '@/entities/chat'

import { useFormattedTime } from '@/shared/lib/date-time'
import { cn } from '@/shared/lib/styling'
import { Typography } from '@/shared/ui/Typography'

import * as ChatAttachment from './ChatAttachement'

const WWW_URL_PATTERN = /^www\./i

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleText
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleTextProps = {
  position: 'left' | 'right'
  text: string
}

const ChatBubbleText: FC<ChatBubbleTextProps> = (props) => {
  const { actionSheet } = useChatContext()

  // TODO add error handling
  const onUrlPress = useCallback((url: string) => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) onUrlPress(`https://${url}`)
    else
      Linking.openURL(url).catch((e) => {
        console.error(e, 'No handler for URL:', url)
      })
  }, [])

  // TODO add error handling
  const onPhonePress = useCallback(
    (phone: string) => {
      const options = ['Call', 'Text', 'Cancel']
      const cancelButtonIndex = options.length - 1

      actionSheet().showActionSheetWithOptions({ cancelButtonIndex, options }, (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Linking.openURL(`tel:${phone}`).catch((e) => {
              console.error(e, 'No handler for telephone')
            })
            break
          case 1:
            Linking.openURL(`sms:${phone}`).catch((e) => {
              console.error(e, 'No handler for text')
            })
            break
        }
      })
    },
    [actionSheet],
  )

  // TODO add error handling
  const onEmailPress = useCallback(
    (email: string) => Linking.openURL(`mailto:${email}`).catch((e) => console.error(e, 'No handler for mailto')),
    [],
  )

  const linkClassName = cn('underline', props.position === 'left' ? 'text-primary' : 'text-white')

  const parse: ParseShape[] = useMemo(
    () => [
      { className: linkClassName, onPress: onUrlPress, type: 'url' },
      { className: linkClassName, onPress: onPhonePress, type: 'phone' },
      { className: linkClassName, onPress: onEmailPress, type: 'email' },
    ],
    [linkClassName, onUrlPress, onPhonePress, onEmailPress],
  )

  const textClassName = cn('font-publicSans text-base', props.position === 'left' ? 'text-gray-900' : 'text-white')

  return (
    <ParsedText childrenProps={{ className: textClassName }} parse={parse}>
      {props.text}
    </ParsedText>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleTIme
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleTimeProps = BubbleProps<ChatMessage>

const ChatBubbleTime: FC<ChatBubbleTimeProps> = (props) => {
  const formattedTime = useFormattedTime(props.currentMessage.createdAt)

  return (
    props.renderTime?.(props) ?? (
      <Typography className={cn('text-xs opacity-65', props.position === 'left' ? 'text-gray-900' : 'text-white')}>
        {formattedTime}
      </Typography>
    )
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleUsername
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleUsernameProps = BubbleProps<ChatMessage>

const ChatBubbleUsername: FC<ChatBubbleUsernameProps> = (props) =>
  props.renderUsername?.(props.currentMessage.user) ?? (
    <Typography className="mb-1.5 font-semibold text-primary text-xs">
      {props.currentMessage.user.name} {props.position === 'left' ? <ChatBubbleTime {...props} /> : null}
    </Typography>
  )

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleAttachments
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleAttachmentsProps = {
  className?: string
  attachments: UserChatMessageAttachment[]
}

const ChatBubbleAttachments: FC<ChatBubbleAttachmentsProps> = ({ attachments, className }) => {
  const handleDownload = useCallback(async (attachment: UserChatMessageAttachment) => {
    try {
      await Share.share({ url: attachment.uri })
    } catch (error) {
      console.error('Error sharing', error)
    }
  }, [])

  return (
    <View className={cn('min-w-full gap-1', className)}>
      {attachments.map((attachment, index) => (
        <ChatAttachment.Root key={`${attachment.uri}-${index}`} onPress={() => handleDownload(attachment)}>
          <ChatAttachment.Icon name={resolveAttachmentIcon(attachment)} />
          <ChatAttachment.Content name={attachment.fileName ?? attachment.uri} tip={getAttachmentTip(attachment)} />
          <ChatAttachment.Action className="text-blue-700" name="arrow-down-tray.outlined" />
        </ChatAttachment.Root>
      ))}
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubble
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleProps = BubbleProps<ChatMessage> & {
  className?: string
}

const ChatBubble: FC<ChatBubbleProps> = (props) => {
  const attachments = 'attachments' in props.currentMessage ? props.currentMessage.attachments : null

  return (
    <View className={cn(props.position === 'left' ? 'items-start' : 'items-end')}>
      <View
        className={cn(
          'rounded-[10] px-3 py-2',
          props.position === 'left' ? 'max-w-full border border-black/7 bg-white' : 'max-w-[80%] bg-primary',
        )}
      >
        {/* render username for incomming messages only  */}
        {!props.renderUsernameOnMessage || props.position !== 'left' ? null : <ChatBubbleUsername {...props} />}

        {/* render attachments for outgoing full-width */}
        {props.position !== 'right' || !attachments?.length ? null : (
          <ChatBubbleAttachments attachments={attachments} className="mb-1.5" />
        )}

        <View className="flex-row items-end gap-2.5">
          <View className="shrink">
            {props.renderMessageText?.(props) ?? (
              <>
                {props.position !== 'left' || !attachments?.length ? null : (
                  <ChatBubbleAttachments attachments={attachments} className="mb-1.5" />
                )}
                {!props.currentMessage.text ? null : (
                  <ChatBubbleText position={props.position} text={props.currentMessage.text} />
                )}
              </>
            )}
          </View>

          {props.position === 'right' ? (
            <View>
              <ChatBubbleTime {...props} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatBubble }

export type { ChatBubbleProps }
