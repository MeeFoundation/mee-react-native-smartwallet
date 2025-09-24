import { type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  Actions,
  type ActionsProps,
  Composer,
  type ComposerProps,
  type DayProps,
  GiftedChat,
  InputToolbar,
  type InputToolbarProps,
  type MessageProps,
  type SendProps,
} from 'react-native-gifted-chat'

import type { ChatMessage as ChatMessageType, ChatUser } from '@/entities/chat'
import type { Group } from '@/entities/group'

import { colors } from '@/shared/config'
import { localizeRelativeDate } from '@/shared/lib/date-time'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { PLACEHOLDER_TEXT_COLOR } from '@/shared/ui/TextInput'
import { Typography } from '@/shared/ui/Typography'

import { ChatMessage } from './ChatMessage'

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

const composerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors['black/07'],
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    height: 40,
    paddingHorizontal: 16,
  },
})

// FIXME Add custom component to handle focus styles
const useRenderComposer = () => {
  const { t: groupsT } = useTranslation('groups')

  return useCallback(
    (props: ComposerProps) => (
      <Composer
        {...props}
        placeholder={groupsT('chat.input.placeholder')}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        textInputStyle={[
          composerStyles.container,
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

  const renderMessage = useCallback((props: MessageProps<ChatMessageType>) => <ChatMessage {...props} />, [])

  const { t } = useTranslation()
  const renderDay = useCallback(
    (props: DayProps) => {
      const formattedDate = localizeRelativeDate(t, Date.now(), props.createdAt)

      return (
        <View className="mx-auto mb-4.5 rounded-[6] border border-black/7 bg-white/65 px-2.5 py-1">
          <Typography className="text-xs opacity-65">{formattedDate}</Typography>
        </View>
      )
    },
    [t],
  )

  return (
    <GiftedChat
      messages={props.messages}
      onSend={props.onSend}
      renderActions={renderActions}
      renderAvatarOnTop
      renderComposer={renderComposer}
      renderDay={renderDay}
      renderFooter={renderFooter}
      renderInputToolbar={renderInputToolbar}
      renderMessage={renderMessage}
      renderSend={renderSend}
      renderUsernameOnMessage
      user={props.currentUser}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupChat }

export type { GroupChatProps }
