import { type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  Actions,
  type ActionsProps,
  Bubble,
  type BubbleProps,
  Composer,
  type ComposerProps,
  GiftedChat,
  InputToolbar,
  type InputToolbarProps,
  Message,
  type MessageProps,
  type SendProps,
} from 'react-native-gifted-chat'

import type { ChatMessage as ChatMessageType, ChatUser } from '@/entities/chat'
import type { Group } from '@/entities/group'

import { colors } from '@/shared/config'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { PLACEHOLDER_TEXT_COLOR, textInputStyles } from '@/shared/ui/TextInput'

/* -------------------------------------------------------------------------------------------------
 * SendButton
 * -----------------------------------------------------------------------------------------------*/
const sendButtonStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  disabled: {
    backgroundColor: colors['black/10'],
  },

  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    paddingLeft: 6,
    paddingRight: 4,
    paddingVertical: 5,
    width: 26,
  },
})

const useRenderSend = () =>
  useCallback((p: SendProps<ChatMessageType>) => {
    const disabled = p.disabled || !p.text

    const handleSend = () => {
      if (p.text && p.onSend) {
        p.onSend({ text: p.text.trim() }, true)
      }
    }

    return (
      <TouchableOpacity
        {...p.sendButtonProps}
        disabled={disabled}
        onPress={handleSend}
        // Don't set containerStyle here — Toolbar already applies its own styles,
        // and they will override anything we add.
        style={sendButtonStyles.container}
      >
        <View style={[sendButtonStyles.sendButton, disabled && sendButtonStyles.disabled]}>
          <IconSymbol color={colors.white} height={14} name="paper-airplane.filled" width={14} />
        </View>
      </TouchableOpacity>
    )
  }, [])

/* -------------------------------------------------------------------------------------------------
 * InputToolbar
 * -----------------------------------------------------------------------------------------------*/
const chatInputToolbarStyles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    marginTop: 12,
  },
  primary: {
    alignItems: 'flex-start',
  },
})

const useChatInputToolbar = () =>
  useCallback(
    (props: InputToolbarProps<ChatMessageType>) => (
      <InputToolbar
        {...props}
        containerStyle={[chatInputToolbarStyles.container, props.containerStyle]}
        primaryStyle={[chatInputToolbarStyles.primary, props.primaryStyle]}
      />
    ),
    [],
  )

/* -------------------------------------------------------------------------------------------------
 * ChatBubble
 * -----------------------------------------------------------------------------------------------*/
const chatBubbleStyles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 0,

    /**
     * Wee need to set every style to 0 to avoid the default styles from the library
     */
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
  },
  textLeft: {
    color: colors['gray-900'],
  },
  textRight: {
    color: colors.white,
  },
  wrapper: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

    /**
     * Wee need to set every corner radius to avoid the default styles from the library
     */
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  wrapperLeft: {
    backgroundColor: colors.white,
    borderColor: colors['black/07'],
    borderWidth: 1,
    maxWidth: '100%',
  },
  wrapperRight: {
    backgroundColor: colors.primary,
    maxWidth: '80%',
  },
})

const useChatBubble = () =>
  useCallback(
    (props: BubbleProps<ChatMessageType>) => (
      <Bubble
        {...props}
        containerStyle={props.containerStyle}
        textStyle={{
          left: [chatBubbleStyles.text, chatBubbleStyles.textLeft, props.textStyle?.left],
          right: [chatBubbleStyles.text, chatBubbleStyles.textRight, props.textStyle?.right],
        }}
        wrapperStyle={{
          left: [chatBubbleStyles.wrapper, chatBubbleStyles.wrapperLeft, props.wrapperStyle?.left],
          right: [chatBubbleStyles.wrapper, chatBubbleStyles.wrapperRight, props.wrapperStyle?.right],
        }}
      />
    ),
    [],
  )

/* -------------------------------------------------------------------------------------------------
 * ChatMessage
 * -----------------------------------------------------------------------------------------------*/
const chatMessageStyles = StyleSheet.create({
  container: {
    gap: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginTop: 0,
    paddingLeft: 0,
  },
  previousDifferentUser: {
    marginTop: 8,
  },
  previousSameUser: {
    marginTop: 2,
  },
})

const useChatMessage = () =>
  useCallback((props: MessageProps<ChatMessageType>) => {
    const prevUserStyle =
      props.previousMessage?.user?._id === props.currentMessage?.user?._id
        ? chatMessageStyles.previousSameUser
        : chatMessageStyles.previousDifferentUser

    return (
      <Message
        {...props}
        containerStyle={{
          left: [chatMessageStyles.container, prevUserStyle, props.containerStyle?.left],
          right: [chatMessageStyles.container, prevUserStyle, props.containerStyle?.right],
        }}
      />
    )
  }, [])

/* -------------------------------------------------------------------------------------------------
 * Acrions
 * -----------------------------------------------------------------------------------------------*/
const useChatActionOptions = () => {
  const { t: groupsT } = useTranslation('groups')

  const handleAttachFile = useCallback(() => {
    // FIXME Implement
    throw new Error('Attach file')
  }, [])

  const handleCancel = useCallback(() => {}, [])

  const attachFileKey = groupsT('chat.actions.attach_file.text')
  const cancelKey = groupsT('chat.actions.cancel.text')

  const options: {
    [key: string]: () => void
  } = useMemo(() => {
    const result: { [key: string]: () => void } = {}

    result[attachFileKey] = handleAttachFile
    result[cancelKey] = handleCancel

    return result
  }, [attachFileKey, cancelKey, handleAttachFile, handleCancel])

  return options
}

const useRenderActions = () => {
  const options = useChatActionOptions()

  return useCallback(
    (props: ActionsProps) => {
      return (
        <Actions
          {...props}
          containerStyle={{
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
            marginLeft: 0,
            width: 40,
          }}
          icon={() => <IconSymbol color={colors['gray-800']} height={24} name="plus.outlined" width={24} />}
          options={options}
        />
      )
    },
    [options],
  )
}

const useRenderComposer = () => {
  const { t: groupsT } = useTranslation('groups')

  return useCallback(
    (props: ComposerProps) => (
      <Composer
        {...props}
        placeholder={groupsT('chat.input.placeholder')}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        textInputStyle={[
          textInputStyles.textInput,
          props.textInputStyle,
          { marginLeft: 0, marginTop: 0, minHeight: 40 },
        ]}
      />
    ),
    [groupsT],
  )
}
/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/
const useRenderFooter = (loading: boolean | undefined) =>
  useMemo(() => (loading ? () => <ActivityIndicator color={colors.primary} size="small" /> : undefined), [loading])

/* -------------------------------------------------------------------------------------------------
 * Nothing
 * -----------------------------------------------------------------------------------------------*/
const useRenderNothing = () => useCallback(() => null, [])

/* -------------------------------------------------------------------------------------------------
 * GroupChat
 * -----------------------------------------------------------------------------------------------*/
type GroupChatProps = {
  group: Group
  currentUser: ChatUser
  onSend: (message: ChatMessageType[]) => void
  messages: ChatMessageType[]
  loading?: boolean
}

const GroupChat: FC<GroupChatProps> = (props) => {
  const renderActions = useRenderActions()
  const renderComposer = useRenderComposer()
  const renderFooter = useRenderFooter(props.loading)
  const renderInputToolbar = useChatInputToolbar()
  const renderSend = useRenderSend()
  const renderBubble = useChatBubble()
  const renderMessage = useChatMessage()
  const renderNothing = useRenderNothing()

  return (
    <GiftedChat
      messages={props.messages}
      onSend={props.onSend}
      renderActions={renderActions}
      renderAvatarOnTop
      renderBubble={renderBubble}
      renderComposer={renderComposer}
      renderDay={renderNothing}
      renderFooter={renderFooter}
      renderInputToolbar={renderInputToolbar}
      renderMessage={renderMessage}
      renderSend={renderSend}
      renderTime={renderNothing}
      user={props.currentUser}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupChat }

export type { GroupChatProps }
