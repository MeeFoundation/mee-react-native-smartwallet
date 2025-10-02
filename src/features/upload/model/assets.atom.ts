import type * as ImagePicker from 'expo-image-picker'
import { atom } from 'jotai'
import { atomFamily, atomWithDefault } from 'jotai/utils'

export type AssetsGroupIdentifier = string

export const getAssetsAtom = atomFamily((_assetsGroupIdentifier: AssetsGroupIdentifier) =>
  atomWithDefault((): ImagePicker.ImagePickerAsset[] => []),
)

export const addAssetAtom = atom(
  null,
  (
    _get,
    set,
    assetsGroupIdentifier: AssetsGroupIdentifier,
    asset: ImagePicker.ImagePickerAsset[] | ImagePicker.ImagePickerAsset,
  ) => set(getAssetsAtom(assetsGroupIdentifier), (prev) => [...prev, ...[asset].flat()]),
)

export const removeAssetAtom = atom(null, (_get, set, id: AssetsGroupIdentifier, ...assetUris: string[]) =>
  set(getAssetsAtom(id), (prev) => prev.filter((a) => !assetUris.includes(a.uri))),
)

export const clearAssetsAtom = atom(null, (_get, set, id: AssetsGroupIdentifier) => set(getAssetsAtom(id), []))
