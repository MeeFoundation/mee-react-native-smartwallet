import { atomFamily, atomWithDefault } from 'jotai/utils'

import { getMyGroupPersonalDetails } from '../api/get-my-group-pesonal-details'
import { MyGroupPersonalDetailsView } from './my-group-personal-details.view'

export const getMyGroupPersonalDetailsAtom = atomFamily((groupId: string) =>
  atomWithDefault(() => getMyGroupPersonalDetails(groupId)),
)

export const getMyGroupPersonalDetailsViewAtom = atomFamily((groupId: string) =>
  atomWithDefault(async (get) => {
    const myGroupInfo = await get(getMyGroupPersonalDetailsAtom(groupId))
    return MyGroupPersonalDetailsView.from(myGroupInfo.attributes)
  }),
)
