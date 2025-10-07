import type BottomSheet from '@gorhom/bottom-sheet'
import { type FC, type RefObject, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, View } from 'react-native'

import { useSelectFromGalery, useUpload } from '@/features/upload'

import { BottomSheetBackDrop } from '@/shared/ui/BottomSheet'

/* -------------------------------------------------------------------------------------------------
 *  ActionsBackdrop
 * -----------------------------------------------------------------------------------------------*/
type ActionsBackdropProps = {
  ref: RefObject<BottomSheet | null>
}

const ActionsBackdrop: FC<ActionsBackdropProps> = ({ ref }) => {
  const { addAsset } = useUpload()
  const { t: groupsT } = useTranslation('groups')

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
        <Button onPress={handleAttachGaleryPress} title={groupsT('chat.actions.attach_file.text')} />
        <Button onPress={handleCancel} title={groupsT('chat.actions.cancel.text')} />
      </View>
    </BottomSheetBackDrop>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ActionsBackdrop }

export type { ActionsBackdropProps }
