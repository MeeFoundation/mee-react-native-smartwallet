import { type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  Actions,
  type ActionsProps,
  Composer,
  type ComposerProps,
  type DayProps,
  GiftedChat,
  InputToolbar,
  type InputToolbarProps,
  type LoadEarlierProps,
  type MessageProps,
  type SendProps,
} from 'react-native-gifted-chat'
import type { ListViewProps } from 'react-native-gifted-chat/lib/MessageContainer'

import { UploadProvider, useSelectFromGalery, useUpload } from '@/features/upload'

import type { ChatMessage as ChatMessageType, ChatUser } from '@/entities/chat'
import type { Group } from '@/entities/group'

import { colors } from '@/shared/config'
import { localizeRelativeDate } from '@/shared/lib/date-time'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { Spinner } from '@/shared/ui/Spinner'
import { PLACEHOLDER_TEXT_COLOR } from '@/shared/ui/TextInput'
import { Typography } from '@/shared/ui/Typography'

import * as ChatAttachment from './ChatAttachement'
import { ChatMessage } from './ChatMessage'
import { ChatTypingIndicator } from './ChatTytpingIndicator'

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

const useRenderSend = () => {
  const { assets } = useUpload()

  return useCallback(
    (p: SendProps<ChatMessageType>) => {
      const disabled = p.disabled || (!p.text && !assets.length)

      const handleSend = () => {
        if (!disabled && p.onSend) {
          p.onSend({ attachments: assets, text: p.text?.trim() }, true)
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
    },
    [assets],
  )
}

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

type InputToolbarWithAssetsProps = InputToolbarProps<ChatMessageType>

const InputToolbarWithAssets: FC<InputToolbarWithAssetsProps> = (props) => {
  const { assets, removeAsset } = useUpload()

  return (
    <View>
      {!assets.length ? null : (
        <View className="mt-2 gap-1 rounded-[10] bg-white px-3 py-2.5">
          {assets.map((asset, index) => (
            <ChatAttachment.Root key={`${asset.uri}-${index}`}>
              <ChatAttachment.Icon />
              <ChatAttachment.Content name={asset.fileName ?? asset.uri} />
              <ChatAttachment.Action name="x-mark.outlined" onPress={() => removeAsset(asset.uri)} />
            </ChatAttachment.Root>
          ))}
        </View>
      )}

      <InputToolbar
        {...props}
        containerStyle={[chatInputToolbarStyles.container, props.containerStyle]}
        primaryStyle={[chatInputToolbarStyles.primary, props.primaryStyle]}
      />
    </View>
  )
}

const useChatInputToolbar = () =>
  useCallback((props: InputToolbarProps<ChatMessageType>) => <InputToolbarWithAssets {...props} />, [])

/* -------------------------------------------------------------------------------------------------
 * Actions
 * -----------------------------------------------------------------------------------------------*/
const useChatActionOptions = () => {
  const { t: groupsT } = useTranslation('groups')
  const { addAsset } = useUpload()

  const selectFromGalery = useSelectFromGalery(addAsset)

  const handleCancel = useCallback(() => {}, [])

  const attachFileKey = groupsT('chat.actions.attach_file.text')
  const cancelKey = groupsT('chat.actions.cancel.text')

  const options: {
    [key: string]: () => void
  } = useMemo(() => {
    const result: { [key: string]: () => void } = {}

    result[attachFileKey] = selectFromGalery
    result[cancelKey] = handleCancel

    return result
  }, [attachFileKey, cancelKey, selectFromGalery, handleCancel])

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

type ChatLoadEarlierProps = LoadEarlierProps

const ChatLoadEarlier: FC<ChatLoadEarlierProps> = (props) => {
  const { t: chatT } = useTranslation('chat')

  return props.isLoadingEarlier ? (
    <View className="my-2 items-center gap-1">
      <View className="h-4 w-4">
        <Spinner />
      </View>
      <View>
        <Typography className="text-gray-900 text-xs opacity-65">{chatT('loading messages')}</Typography>
      </View>
    </View>
  ) : null
}

/* -------------------------------------------------------------------------------------------------
 *  ChatLoading
 * -----------------------------------------------------------------------------------------------*/
const ChatLoading: FC = () => {
  const { t: chatT } = useTranslation('chat')

  const renderActions = useRenderActions()
  const renderComposer = useRenderComposer()
  const renderInputToolbar = useChatInputToolbar()
  const renderSend = useRenderSend()

  return (
    <View style={{ flex: 1 }}>
      <View className="items-center justify-center gap-3" style={{ flex: 1 }}>
        <View className="h-10 w-10">
          <Spinner />
        </View>
        <Typography>{chatT('loading messages')}</Typography>
      </View>

      {/* TODO add disabled state */}
      {renderInputToolbar({
        renderActions,
        renderComposer,
        renderSend,
      })}
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 *  ChatContent
 *
 * @note Wee need this component to wrap the whole chat to UploadProvider
 * -----------------------------------------------------------------------------------------------*/
const ChatContent: FC<ChatProps> = (props) => {
  const { t } = useTranslation()
  const renderActions = useRenderActions()
  const renderComposer = useRenderComposer()
  const renderInputToolbar = useChatInputToolbar()
  const renderSend = useRenderSend()

  const renderMessage = useCallback((props: MessageProps<ChatMessageType>) => <ChatMessage {...props} />, [])

  const renderDay = useCallback(
    (props: DayProps) => {
      const formattedDate = localizeRelativeDate(t, Date.now(), props.createdAt)

      return (
        <View className="mx-auto my-4.5 rounded-[6] border border-black/7 bg-white/65 px-2.5 py-1">
          <Typography className="text-xs opacity-65">{formattedDate}</Typography>
        </View>
      )
    },
    [t],
  )

  const useRenderTypingIndicator = useCallback(
    () => (!props.typingUsers?.length ? null : <ChatTypingIndicator typingUsers={props.typingUsers} />),
    [props.typingUsers],
  )

  const listViewProps = useMemo(
    (): ListViewProps => ({
      // @ts-expect-error it's the view prop, but in gifted typings it is set as `{ onLayout } & object`
      refreshControl: <RefreshControl onRefresh={props.onRefresh} refreshing={!!props.refreshing} />,
    }),
    [props.onRefresh, props.refreshing],
  )

  if (props.loading) return <ChatLoading />

  return (
    <GiftedChat
      infiniteScroll
      isLoadingEarlier={props.isLoadingEarlier}
      listViewProps={listViewProps}
      loadEarlier={!props.allLoaded}
      messages={props.messages}
      onLoadEarlier={props.onLoadEarlier}
      onSend={props.onSend}
      renderActions={renderActions}
      renderAvatarOnTop
      renderComposer={renderComposer}
      renderDay={renderDay}
      renderInputToolbar={renderInputToolbar}
      renderLoadEarlier={(props) => <ChatLoadEarlier {...props} />}
      renderMessage={renderMessage}
      renderSend={renderSend}
      renderTypingIndicator={useRenderTypingIndicator}
      renderUsernameOnMessage
      user={props.currentUser}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 *  Chat
 * -----------------------------------------------------------------------------------------------*/
type ChatProps = {
  group: Group
  currentUser: ChatUser
  messages: ChatMessageType[]
  loading?: boolean
  typingUsers?: string[]

  onSend: (message: ChatMessageType[]) => void

  allLoaded?: boolean
  isLoadingEarlier?: boolean
  onLoadEarlier?: () => void

  refreshing?: boolean
  onRefresh?: () => void
}

const Chat: FC<ChatProps> = (props) => (
  <UploadProvider assetsGroupIdentifier={`groip-chat-${props.group.id}`}>
    <ChatContent {...props} />
  </UploadProvider>
)

/* -----------------------------------------------------------------------------------------------*/

export { Chat }

export type { ChatProps }
