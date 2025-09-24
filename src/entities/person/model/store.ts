import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'

import {
  INITIAL_PAGINATED_STATE,
  makeGetManagePaginatedStateAtom,
  type PaginatedListState,
  type PaginatedStateAtom,
} from '@/shared/lib/paginated-list'

import { personsService } from './service'
import type { PersonsListFetchParams, ShortPerson } from './types'

export type PaginatedPersonsListState = PaginatedListState<ShortPerson>

export const getPaginatedPersonsListStateAtom = atomFamily<PersonsListFetchParams, PaginatedStateAtom<ShortPerson>>(
  () => atom(INITIAL_PAGINATED_STATE),
  isEqual,
)

export const getManagePaginatedPersonsListAtom = makeGetManagePaginatedStateAtom(
  getPaginatedPersonsListStateAtom,
  personsService.getPersons,
)
