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

export const getObjectItem = <T>(key: string): T | null => {
  const value = storage.getString(key)
  return value ? JSON.parse(value) : null
}

export const setObjectItem = <T>(key: string, value: T): void => {
  storage.set(key, JSON.stringify(value))
}
