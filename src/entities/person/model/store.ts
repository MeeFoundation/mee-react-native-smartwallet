import { DEFAULT_PAGE_SIZE } from "@/shared/config"
import { AppError, UnknownError } from "@/shared/errors"
import {
  INITIAL_PAGINATED_STATE,
  type PaginatedListState,
  type PaginationAction,
} from "@/shared/lib/paginated-list"
import { atom, type SetStateAction, type WritableAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { isEqual } from "lodash-es"
import { personsService } from "./service"
import type {
  PersonsListFetchParams,
  PersonsPaginatedListFetchParams,
  PersonsPaginatedListResponse,
  ShortPerson,
} from "./types"

type PaginatedPersonsListState = PaginatedListState<ShortPerson>

export const getPaginatedPersonsListStateAtom = atomFamily<
  PersonsListFetchParams,
  WritableAtom<PaginatedPersonsListState, [SetStateAction<PaginatedPersonsListState>], void>
>((_params: PersonsListFetchParams) => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedPersonsListAtom = atomFamily((params: PersonsListFetchParams) => {
  const personsDataAtom = getPaginatedPersonsListStateAtom(params)

  return atom(null, async (get, set, action: PaginationAction) => {
    const currentState = get(personsDataAtom)

    const fetchParams: PersonsPaginatedListFetchParams = {
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
        const newData: PersonsPaginatedListResponse =
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
