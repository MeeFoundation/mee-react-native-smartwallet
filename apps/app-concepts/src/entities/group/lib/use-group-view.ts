import { useMemo } from 'react'

import { GroupView } from '../model/group.view'
import type { Group } from '../model/types'

export const useGroupView = (group: Group) => useMemo(() => GroupView.from(group), [group])
