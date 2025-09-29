import { useMemo } from 'react'

import { ShortGroupView } from '../model/short-group.view'
import type { ShortGroup } from '../model/types'

export const useShortGroupView = (group: ShortGroup) => useMemo(() => ShortGroupView.from(group), [group])
