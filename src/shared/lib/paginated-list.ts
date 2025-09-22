import type { AppError } from "@/shared/errors"
import { useAtomValue, useSetAtom, type Atom, type WritableAtom } from "jotai"
import { useEffect } from "react"
import type { PaginatedListResponse } from "../model/api"

export type PaginationAction = "loadMore" | "refresh" | "reset"

export type PaginatedListState<TItem> = {
  hasNextPage: boolean
  isRefreshing: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
  isFetched: boolean
  data: PaginatedListResponse<TItem> | null
  error: AppError | null
}

export const INITIAL_PAGINATED_STATE: PaginatedListState<any> = {
  hasNextPage: false,
  isRefreshing: false,
  isFetching: false,
  isFetchingNextPage: false,
  isFetched: false,
  data: null,
  error: null,
}

export const useFetchInitialList = <TItem>(
  listState: PaginatedListState<TItem>,
  manageList: (action: PaginationAction) => void,
) => {
  useEffect(() => {
    if (!listState.isFetched && !listState.isFetching) manageList("reset")
  }, [listState.isFetched, listState.isFetching, manageList])
}

export const usePaginatedState = <TItem, TFetchParams>(
  fetchParams: TFetchParams,
  getStateAtom: (param: TFetchParams) => Atom<PaginatedListState<TItem>>,
  getActionAtom: (
    param: TFetchParams,
  ) => WritableAtom<null, [action: PaginationAction], Promise<void>>,
) => {
  const state = useAtomValue(getStateAtom(fetchParams))
  const manageList = useSetAtom(getActionAtom(fetchParams))

  useFetchInitialList(state, manageList)

  return [state, manageList] as const
}
