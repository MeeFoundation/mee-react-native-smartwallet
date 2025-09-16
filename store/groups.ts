import { DEFAULT_PAGE_SIZE } from "@/constants/api"
import { AppError } from "@/errors/app-error"
import { UnknownError } from "@/errors/unknown.error"
import type { IndexPaginationRequest } from "@/models/api"
import type { Group } from "@/models/group"
import {
  defaultGroupFilter,
  type GroupFilter,
  type GroupsIndexPaginatedResponse,
  type GroupsParams,
  groupsService,
} from "@/services/groups.service"
import {
  INITIAL_PAGINATED_STATE,
  type PaginatedListState,
  type PaginationAction,
} from "@/utils/paginated-list"
import { atom, type SetStateAction, type WritableAtom } from "jotai"
import { atomFamily, atomWithDefault } from "jotai/utils"
import { isEqual } from "lodash-es"

type PaginatedGroupsPersonsListState = PaginatedListState<Group>

export const getPaginatedGroupsListStateAtom = atomFamily<
  GroupsParams,
  WritableAtom<
    PaginatedGroupsPersonsListState,
    [SetStateAction<PaginatedGroupsPersonsListState>],
    void
  >
>((_params: GroupsParams) => atom(INITIAL_PAGINATED_STATE), isEqual)

export const getManagePaginatedGroupsListAtom = atomFamily((params: GroupsParams) => {
  const groupsDataAtom = getPaginatedGroupsListStateAtom(params)

  return atom(null, async (get, set, action: PaginationAction) => {
    const currentState = get(groupsDataAtom)

    const fetchParams: IndexPaginationRequest & GroupsParams = {
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
        const newData: GroupsIndexPaginatedResponse =
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

// remove
export const groupFilterAtom = atomWithDefault<GroupFilter>(() => defaultGroupFilter)

export const GroupDetails = atomFamily((id: string) =>
  atom(
    async () => {
      return groupsService.getGroupDetails(id)
    },
    async (_, __, _group: Group) => {
      throw new Error("Not implemented")
      // const groups = await get(groupsStore)
      // const updatedGroups = groups.map((g) => (g.id === group.id ? group : g))
      // set(groupsStore, updatedGroups)
    },
  ),
)
