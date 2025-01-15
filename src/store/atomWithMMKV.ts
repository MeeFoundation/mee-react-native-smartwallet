import { atomWithStorage, createJSONStorage } from "jotai/utils"
import { clearAll, getItem, removeItem, setItem } from "./storage"

export const atomWithMMKV = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem,
      setItem,
      removeItem,
      clearAll,
    })),
  )
