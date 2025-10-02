// import * as ImagePicker from 'expo-image-picker'
import * as ImagePicker from 'expo-image-picker'
import { useCallback } from 'react'

export const useSelectFromGalery = (cb: (assets: ImagePicker.ImagePickerAsset[]) => void) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions()

  return useCallback(async () => {
    if (!status?.granted) await requestPermission()

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [1, 1],
      mediaTypes: ['images', 'videos'],
      quality: 1,
    })

    if (!result.canceled && result.assets?.length) cb(result.assets)
  }, [cb, requestPermission, status])
}
