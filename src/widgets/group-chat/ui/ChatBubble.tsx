import { type FC, useCallback, useMemo } from 'react'
import { Linking, View } from 'react-native'
import { type BubbleProps, useChatContext } from 'react-native-gifted-chat'
import ParsedText, { type ParseShape } from 'react-native-parsed-text'

import type { ChatMessage } from '@/entities/chat'

import { cn } from '@/shared/lib/cn'
import { useFormattedTime } from '@/shared/lib/date-time'
import { Typography } from '@/shared/ui/Typography'

const WWW_URL_PATTERN = /^www\./i

/* -------------------------------------------------------------------------------------------------
 * ChatBubble
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleProps = BubbleProps<ChatMessage> & {
  className?: string
}

const ChatBubble: FC<ChatBubbleProps> = (props) => {
  const { actionSheet } = useChatContext()
  const formattedTime = useFormattedTime(props.currentMessage.createdAt)

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

  // FIXME Link for my message
  const linkClassName = cn('underline', props.position === 'left' ? 'text-primary' : 'text-white')

  const parse: ParseShape[] = useMemo(
    () => [
      { className: linkClassName, onPress: onUrlPress, type: 'url' },
      { className: linkClassName, onPress: onPhonePress, type: 'phone' },
      { className: linkClassName, onPress: onEmailPress, type: 'email' },
    ],
    [linkClassName, onUrlPress, onPhonePress, onEmailPress],
  )

  return (
    <View className={cn(props.position === 'left' ? 'items-start' : 'items-end')}>
      <View
        className={cn(
          'rounded-[10] px-3 py-2',
          props.position === 'left' ? 'max-w-full border border-black/7 bg-white' : 'max-w-[80%] bg-primary',
        )}
      >
        {/* render username for incomming messages only  */}
        {!props.renderUsernameOnMessage || props.position !== 'left'
          ? null
          : (props.renderUsername?.(props.currentMessage.user) ?? (
              <Typography className="font-semibold text-primary text-xs">{props.currentMessage.user.name}</Typography>
            ))}

        <View className="flex-row items-end gap-2.5">
          <View className="shrink">
            {props.renderMessageText?.(props) ?? (
              <ParsedText
                childrenProps={{
                  className: cn(
                    'font-publicSans text-base',
                    props.position === 'left' ? 'text-gray-900' : 'text-white',
                  ),
                }}
                parse={parse}
              >
                {props.currentMessage.text}
              </ParsedText>
            )}
          </View>

          {props.renderTime?.(props) ?? (
            <View>
              <Typography
                className={cn('text-xs opacity-65', props.position === 'left' ? 'text-gray-900' : 'text-white')}
              >
                {formattedTime}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatBubble }

export type { ChatBubbleProps }
