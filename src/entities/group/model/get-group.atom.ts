import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { groupsService } from './service'

export const getGroupAtom = atomFamily((id: string) =>
  atom(async () => {
    return groupsService.getGroupDetails(id)
  }),
)
