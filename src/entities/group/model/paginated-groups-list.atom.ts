import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'

import {
  INITIAL_PAGINATED_STATE,
  makeGetManagePaginatedStateAtom,
  type PaginatedListState,
  type PaginatedStateAtom,
} from '@/shared/lib/paginated-list'

import { groupsService } from './service'
import type { GroupsListFetchParams, ShortGroup } from './types'

export type PaginatedGroupsPersonsListState = PaginatedListState<ShortGroup>

export const getGroupsListStateAtom = atomFamily<GroupsListFetchParams, PaginatedStateAtom<ShortGroup>>(
  () => atom(INITIAL_PAGINATED_STATE),
  isEqual,
)

export const getManageGroupListAtom = makeGetManagePaginatedStateAtom(getGroupsListStateAtom, groupsService.getGroups)
