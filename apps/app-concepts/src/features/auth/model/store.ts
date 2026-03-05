import { atom } from 'jotai'

import { makeAtomWithMMKV } from '@/shared/model'

export const isAuthenticatedAtom = atom(false)
export const isFirstTimeAuthAtom = makeAtomWithMMKV('firstTimeAuth', true)
