import { makeAtomWithMMKV } from "@/shared/model"
import { atom } from "jotai"

export const isAuthenticatedAtom = atom(false)
export const isFirstTimeAuthAtom = makeAtomWithMMKV("firstTimeAuth", true)
