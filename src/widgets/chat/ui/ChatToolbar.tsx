import { type FC, useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useUpload } from '@/features/upload'

import { cn } from '@/shared/lib/styling'
import { IconButton } from '@/shared/ui/IconButton'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { TextInput } from '@/shared/ui/TextInput'

import * as ChatAttachment from './ChatAttachement'

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
}

const ChatToolbar: FC<ChatToolbarProps> = (props) => {
  const [value, setValue] = useState('')
  const { assets, removeAsset } = useUpload()

  const handleSend = useCallback(() => {
    props.onSend?.(value)
    setValue('')
  }, [props.onSend, value])

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

      <View className="h-12 flex-row items-center">
        <View className="size-10 items-center justify-center">
          <IconButton disabled={props.disabled} icon="plus.outlined" onPress={props.onToggleActions} />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput onChangeText={setValue} size="sm" value={value} />
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
