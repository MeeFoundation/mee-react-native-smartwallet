import type { GroupsFilter } from '../model/types'

export const defaultGroupFilter: GroupsFilter = {
  status: 'active',
}

export const emptyGroupFilter: GroupsFilter = {
  status: null,
}
