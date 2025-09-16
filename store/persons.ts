import { DEFAULT_PAGE_SIZE } from "@/constants/api"
import { AppError } from "@/errors/app-error"
import { UnknownError } from "@/errors/unknown.error"
import type { IndexPaginationRequest } from "@/models/api"
import type { Person } from "@/models/person"

import {
  personsService,
  type PersonsIndexPaginatedResponse,
  type PersonsParams,
} from "@/services/persons.service"
import {
  INITIAL_PAGINATED_STATE,
  type PaginatedListState,
  type PaginationAction,
} from "@/utils/paginated-list"
import { atom, type SetStateAction, type WritableAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { isEqual } from "lodash-es"

type PaginatedPersonsListState = PaginatedListState<Person>

export const getPaginatedPersonsListStateAtom = atomFamily<
  PersonsParams,
  WritableAtom<PaginatedPersonsListState, [SetStateAction<PaginatedPersonsListState>], void>
>((_params: PersonsParams) => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedPersonsListAtom = atomFamily((params: PersonsParams) => {
  const personsDataAtom = getPaginatedPersonsListStateAtom(params)

  return atom(null, async (get, set, action: PaginationAction) => {
    const currentState = get(personsDataAtom)

    const fetchParams: IndexPaginationRequest & PersonsParams = {
      ...params,
      startIndex: 0,
      limit: DEFAULT_PAGE_SIZE,
    }

    if (action === "loadMore") {
      /**
       * If there is no next index, there is no more data to load
       */
      if (!currentState.data?.nextIndex) return
      fetchParams.startIndex = currentState.data.nextIndex
    }

    /**
     * Refresh sets the start index to 0
     */
    if (action === "refresh") fetchParams.startIndex = 0

    /**
     * Reset sets the start index to 0
     */
    if (action === "reset") fetchParams.startIndex = 0

    set(personsDataAtom, (prev) => ({
      ...prev,
      isRefreshing: action === "refresh" || action === "reset",
      isFetching: true,
      isFetchingNextPage: action === "loadMore",
    }))

    try {
      const result = await personsService.getPersons(fetchParams)

      set(personsDataAtom, (prev) => {
        /**
         * Only load more adds data to the list
         */
        const newData: PersonsIndexPaginatedResponse =
          action === "loadMore" && prev.data
            ? { ...result, items: [...prev.data.items, ...result.items] }
            : result

        return {
          ...prev,
          data: newData,
          hasNextPage: result.nextIndex !== null,
          isRefreshing: false,
          isFetchingNextPage: false,
          isFetched: true,
          isFetching: false,
          error: null,
        } satisfies PaginatedPersonsListState
      })
    } catch (error) {
      set(personsDataAtom, (prev) => ({
        ...prev,
        isRefreshing: false,
        isFetchingNextPage: false,
        isFetched: true,
        isFetching: false,
        error: error instanceof AppError ? error : new UnknownError(),
      }))
    }
  })
}, isEqual)
