import type * as ImagePicker from 'expo-image-picker'
import { useAtomValue, useSetAtom } from 'jotai'
import { createContext, type FC, type PropsWithChildren, useCallback, useContext, useMemo } from 'react'

import {
  type AssetsGroupIdentifier,
  addAssetAtom,
  clearAssetsAtom,
  getAssetsAtom,
  removeAssetAtom,
} from '../model/assets.atom'

type UploadContext = {
  assets: ImagePicker.ImagePickerAsset[]
  addAsset: (asset: ImagePicker.ImagePickerAsset[] | ImagePicker.ImagePickerAsset) => void
  removeAsset: (assetUri: string) => void
  clearAssets: () => void
}

const uploadContext = createContext<UploadContext>({
  addAsset: () => {},
  assets: [],
  clearAssets: () => {},
  removeAsset: () => {},
})

const useUpload = () => useContext(uploadContext)

/* -------------------------------------------------------------------------------------------------
 * UploadProvider
 * -----------------------------------------------------------------------------------------------*/
type UploadProviderProps = PropsWithChildren & {
  assetsGroupIdentifier: AssetsGroupIdentifier
}

const UploadProvider: FC<UploadProviderProps> = ({ assetsGroupIdentifier, children }) => {
  const assets = useAtomValue(getAssetsAtom(assetsGroupIdentifier))
  const handleAddAsset = useSetAtom(addAssetAtom)
  const handleRemoveAsset = useSetAtom(removeAssetAtom)
  const handleClearAssets = useSetAtom(clearAssetsAtom)

  const clearAssets = useCallback(
    () => handleClearAssets(assetsGroupIdentifier),
    [handleClearAssets, assetsGroupIdentifier],
  )

  const addAsset = useCallback(
    (asset: ImagePicker.ImagePickerAsset[] | ImagePicker.ImagePickerAsset) =>
      handleAddAsset(assetsGroupIdentifier, asset),
    [handleAddAsset, assetsGroupIdentifier],
  )

  const removeAsset = useCallback(
    (assetUri: string) => handleRemoveAsset(assetsGroupIdentifier, assetUri),
    [handleRemoveAsset, assetsGroupIdentifier],
  )

  const vlaue: UploadContext = useMemo(
    () => ({ addAsset, assets, clearAssets, removeAsset, x: 123 }),
    [assets, addAsset, removeAsset, clearAssets],
  )

  return <uploadContext.Provider value={vlaue}>{children}</uploadContext.Provider>
}

/* -----------------------------------------------------------------------------------------------*/

export { UploadProvider }

export type { UploadProviderProps }

export { useUpload }
