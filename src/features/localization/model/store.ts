import { atom, type SetStateAction } from "jotai"

import i18n from "./i18n"
import type { Locale } from "./types"

const languageLocalAtom = atom(i18n.language as Locale)

export const languageAtom = atom(
  (get) => get(languageLocalAtom),
  (get, set, lng: SetStateAction<Locale>) => {
    const newLang = typeof lng === "function" ? lng(get(languageLocalAtom)) : lng
    i18n.changeLanguage(newLang)
    set(languageLocalAtom, newLang)
  },
)
