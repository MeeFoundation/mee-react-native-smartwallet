import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getGroup } from '../api/get-group'

export const getGroupAtom = atomFamily((id: string) =>
  atom(async () => {
    return getGroup(id)
  }),
)
