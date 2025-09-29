import { atom } from 'jotai'

import { defaultGroupFilter } from './service'
import type { GroupsFilter } from './types'

/**
 * Groups screen filter atom
 */
// TODO idk whether it should be a separate atom or a state of a component
export const groupFilterAtom = atom<GroupsFilter>(defaultGroupFilter)
