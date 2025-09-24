import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'

import {
  INITIAL_PAGINATED_STATE,
  makeGetManagePaginatedStateAtom,
  type PaginatedListState,
  type PaginatedStateAtom,
} from '@/shared/lib/paginated-list'

import { defaultGroupFilter, groupsService } from './service'
import type { GroupsFilter, GroupsListFetchParams, ShortGroup } from './types'

export type PaginatedGroupsPersonsListState = PaginatedListState<ShortGroup>

export const getPaginatedGroupsListStateAtom = atomFamily<GroupsListFetchParams, PaginatedStateAtom<ShortGroup>>(
  () => atom(INITIAL_PAGINATED_STATE),
  isEqual,
)

export const getManagePaginatedGroupsListAtom = makeGetManagePaginatedStateAtom(
  getPaginatedGroupsListStateAtom,
  groupsService.getGroups,
)

/**
 * Groups screen filter atom
 */
// TODO idk whether it should be a separate atom or a state of a component
export const groupFilterAtom = atom<GroupsFilter>(defaultGroupFilter)

export const getGroupAtom = atomFamily((id: string) =>
  atom(async () => {
    return groupsService.getGroupDetails(id)
  }),
)
