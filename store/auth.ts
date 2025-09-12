import { atom } from "jotai"
import { makeAtomWithMMKV } from "./mmkv"

export const isAuthenticatedAtom = atom(false)
export const isFirstTimeAuthAtom = makeAtomWithMMKV("firstTimeAuth", true)
