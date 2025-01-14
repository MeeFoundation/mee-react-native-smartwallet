import { MMKV } from "react-native-mmkv"

export const storage = new MMKV()

export const getItem = (key: string): string | null => {
  const value = storage.getString(key)
  return value ? value : null
}

export const setItem = (key: string, value: string): void => {
  storage.set(key, value)
}

export const removeItem = (key: string): void => {
  storage.delete(key)
}

export const clearAll = (): void => {
  storage.clearAll()
}
