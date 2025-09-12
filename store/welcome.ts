import { makeAtomWithMMKV } from "./mmkv"

export const isWelcomeViewedAtom = makeAtomWithMMKV("isWelcomeViewed", false)
