import { DEFAULT_PAGE_SIZE } from "@/shared/config"
import { AppError, UnknownError } from "@/shared/errors"
import {
  INITIAL_PAGINATED_STATE,
  type PaginatedListState,
  type PaginationAction,
} from "@/shared/lib/paginated-list"
import type { PaginatedFetchParams } from "@/shared/model"
import { atom, type SetStateAction, type WritableAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { isEqual } from "lodash-es"
import { defaultGroupFilter, groupsService } from "./service"
import type {
  GroupsFilter,
  GroupsListFetchParams,
  GroupsPaginatedListResponse,
  ShortGroup,
} from "./types"

type PaginatedGroupsPersonsListState = PaginatedListState<ShortGroup>

export const getPaginatedGroupsListStateAtom = atomFamily<
  GroupsListFetchParams,
  WritableAtom<
    PaginatedGroupsPersonsListState,
    [SetStateAction<PaginatedGroupsPersonsListState>],
    void
  >
>((_params: GroupsListFetchParams) => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedGroupsListAtom = atomFamily((params: GroupsListFetchParams) => {
  const groupsDataAtom = getPaginatedGroupsListStateAtom(params)

  return atom(null, async (get, set, action: PaginationAction) => {
    const currentState = get(groupsDataAtom)

    const fetchParams: PaginatedFetchParams & GroupsListFetchParams = {
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

    set(groupsDataAtom, (prev) => ({
      ...prev,
      isRefreshing: action === "refresh" || action === "reset",
      isFetching: true,
      isFetchingNextPage: action === "loadMore",
    }))

    try {
      const result = await groupsService.getGroups(fetchParams)

      set(groupsDataAtom, (prev) => {
        /**
         * Only load more adds data to the list
         */
        const newData: GroupsPaginatedListResponse =
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
        } satisfies PaginatedGroupsPersonsListState
      })
    } catch (error) {
      set(groupsDataAtom, (prev) => ({
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
