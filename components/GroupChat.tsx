import { IconSymbol } from "@/components/IconSymbol"
import { colors } from "@/constants/colors"
import type { ChatMessage as ChatMessageType, ChatUser } from "@/models/chat"
import type { Group } from "@/models/group"
import { useCallback, useMemo, type FC } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native"
import {
  Actions,
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Message,
  type ActionsProps,
  type BubbleProps,
  type ComposerProps,
  type InputToolbarProps,
  type MessageProps,
  type SendProps,
} from "react-native-gifted-chat"
import { PLACEHOLDER_TEXT_COLOR, textInputStyles } from "./TextInput"

/* -------------------------------------------------------------------------------------------------
 * SendButton
 * -----------------------------------------------------------------------------------------------*/
const sendButtonStyles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButton: {
    width: 26,
    height: 26,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    backgroundColor: colors["black/10"],
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
          <IconSymbol name="paper-airplane.filled" width={14} height={14} color={colors.white} />
        </View>
      </TouchableOpacity>
    )
  }, [])

/* -------------------------------------------------------------------------------------------------
 * InputToolbar
 * -----------------------------------------------------------------------------------------------*/
const chatInputToolbarStyles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: "transparent",
    borderTopWidth: 0,
  },
  primary: {
    alignItems: "flex-start",
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
  wrapper: {
    paddingHorizontal: 12,
    paddingVertical: 6,

    /**
     * Wee need to set every corner radius to avoid the default styles from the library
     */
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  wrapperLeft: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors["black/07"],
    maxWidth: "100%",
  },
  wrapperRight: {
    backgroundColor: colors.primary,
    maxWidth: "80%",
  },

  text: {
    fontSize: 16,
    lineHeight: 24,

    /**
     * Wee need to set every style to 0 to avoid the default styles from the library
     */
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  textRight: {
    color: colors.white,
  },
  textLeft: {
    color: colors["gray-900"],
  },
})

const useChatBubble = () =>
  useCallback(
    (props: BubbleProps<ChatMessageType>) => (
      <Bubble
        {...props}
        containerStyle={props.containerStyle}
        wrapperStyle={{
          left: [chatBubbleStyles.wrapper, chatBubbleStyles.wrapperLeft, props.wrapperStyle?.left],
          right: [
            chatBubbleStyles.wrapper,
            chatBubbleStyles.wrapperRight,
            props.wrapperStyle?.right,
          ],
        }}
        textStyle={{
          left: [chatBubbleStyles.text, chatBubbleStyles.textLeft, props.textStyle?.left],
          right: [chatBubbleStyles.text, chatBubbleStyles.textRight, props.textStyle?.right],
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
    marginLeft: 0,
    gap: 0,
    paddingLeft: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  previousSameUser: {
    marginTop: 2,
  },
  previousDifferentUser: {
    marginTop: 8,
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
  const { t: groupsT } = useTranslation("groups")

  const handleAttachFile = useCallback(() => {
    // FIXME Implement
    throw new Error("Attach file")
  }, [])

  const handleCancel = useCallback(() => {}, [])

  const attachFileKey = groupsT("chat.actions.attach_file.text")
  const cancelKey = groupsT("chat.actions.cancel.text")

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
          options={options}
          icon={() => (
            <IconSymbol name="plus.outlined" color={colors["gray-800"]} width={24} height={24} />
          )}
          containerStyle={{
            width: 40,
            height: 40,
            marginLeft: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )
    },
    [options],
  )
}

const useRenderComposer = () => {
  const { t: groupsT } = useTranslation("groups")

  return useCallback(
    (props: ComposerProps) => (
      <Composer
        {...props}
        placeholder={groupsT("chat.input.placeholder")}
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
  useMemo(
    () => (loading ? () => <ActivityIndicator size="small" color={colors.primary} /> : undefined),
    [loading],
  )

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
      renderDay={renderNothing}
      messages={props.messages}
      onSend={props.onSend}
      user={props.currentUser}
      renderActions={renderActions}
      renderSend={renderSend}
      renderInputToolbar={renderInputToolbar}
      renderBubble={renderBubble}
      renderMessage={renderMessage}
      renderAvatarOnTop
      renderFooter={renderFooter}
      renderComposer={renderComposer}
      renderTime={renderNothing}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupChat }

export type { GroupChatProps }
