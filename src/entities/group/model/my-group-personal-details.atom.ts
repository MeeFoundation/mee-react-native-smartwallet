import { atomFamily, atomWithDefault } from 'jotai/utils'

import { getMyGroupPersonalDetails } from '../api/get-my-group-pesonal-details'

export const getMyGroupPersonalDetailsAtom = atomFamily((groupId: string) =>
  atomWithDefault(() => getMyGroupPersonalDetails(groupId)),
)
