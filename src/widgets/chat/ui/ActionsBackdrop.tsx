import type BottomSheet from '@gorhom/bottom-sheet'
import type { ImagePickerAsset } from 'expo-image-picker'
import { type FC, type RefObject, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, View } from 'react-native'

import { useSelectFromGalery } from '@/features/upload'

import { type Attachment, isAttachmentType } from '@/entities/chat'

import { BottomSheetBackDrop } from '@/shared/ui/BottomSheet'

import { useChatContext } from './ChatProvider'

const imagePickerAssetToAttachement = (asset: ImagePickerAsset): Attachment => ({
  fileName: asset.fileName ?? 'Untitled',
  fileSize: asset.fileSize ?? 0,
  id: asset.uri,
  type: asset.type && isAttachmentType(asset.type) ? asset.type : 'file',
  url: asset.uri,
})

/* -------------------------------------------------------------------------------------------------
 *  ActionsBackdrop
 * -----------------------------------------------------------------------------------------------*/
type ActionsBackdropProps = {
  ref: RefObject<BottomSheet | null>
}

const ActionsBackdrop: FC<ActionsBackdropProps> = ({ ref }) => {
  const { addAttachments } = useChatContext()
  const { t: chatT } = useTranslation('chat')

  const addAsset = useCallback(
    (assets: ImagePickerAsset[]) => {
      addAttachments(assets.map((asset) => imagePickerAssetToAttachement(asset)))
    },
    [addAttachments],
  )

  const selectFromGalery = useSelectFromGalery(addAsset)

  const handleAttachGaleryPress = useCallback(async () => {
    await selectFromGalery()
    ref.current?.close()
  }, [ref, selectFromGalery])

  const handleCancel = useCallback(() => {
    ref.current?.close()
  }, [ref])

  return (
    <BottomSheetBackDrop ref={ref} snapPoints={[160]}>
      <View style={{ flex: 1, gap: 8, padding: 16 }}>
        <Button onPress={handleAttachGaleryPress} title={chatT('actions.attach_file.text')} />
        <Button onPress={handleCancel} title={chatT('actions.cancel.text')} />
      </View>
    </BottomSheetBackDrop>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ActionsBackdrop }

export type { ActionsBackdropProps }
