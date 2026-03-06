import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { uniq } from 'lodash-es'

import type { ChatIdentifier } from './types'

export const getIsTypingAtom = atomFamily((_groupId: string) => atom<string[]>([]))

type ChangeIsTypingParams = {
  chatIdentifier: ChatIdentifier
  // TODO: probably it must be an id
  usernames: string[]
}

export const addIsTypingAtom = atom(null, async (_get, set, params: ChangeIsTypingParams) => {
  const isTypingAtom = getIsTypingAtom(params.chatIdentifier)
  set(isTypingAtom, (prev) => uniq([...prev, ...params.usernames]))
})

export const removeIsTypingAtom = atom(null, async (_get, set, params: ChangeIsTypingParams) => {
  const isTypingAtom = getIsTypingAtom(params.chatIdentifier)
  set(isTypingAtom, (prev) => {
    return prev.filter((username) => !params.usernames.includes(username))
  })
})
