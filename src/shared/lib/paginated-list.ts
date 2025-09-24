import { type Atom, atom, type Getter, type Setter, useAtomValue, useSetAtom, type WritableAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { isEqual } from 'lodash-es'
import { type SetStateAction, useEffect } from 'react'

import { AppError, UnknownError } from '@/shared/errors'

import { DEFAULT_PAGE_SIZE } from '../config'
import type { PaginatedFetchParams, PaginatedListResponse } from '../model/api'
import { assertUnreachable } from './assert-unreachable'

export type PaginationAction = 'loadMore' | 'refresh' | 'reset'

export type PaginatedListState<TItem> = {
  hasNextPage: boolean
  isRefreshing: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
  isFetched: boolean
  data: PaginatedListResponse<TItem> | null
  error: AppError | null
}

// biome-ignore lint/suspicious/noExplicitAny: any as it is an empty default state
export const INITIAL_PAGINATED_STATE: PaginatedListState<any> = {
  data: null,
  error: null,
  hasNextPage: false,
  isFetched: false,
  isFetching: false,
  isFetchingNextPage: false,
  isRefreshing: false,
}

export const useFetchInitialList = <TItem>(
  listState: PaginatedListState<TItem>,
  manageList: (action: PaginationAction) => void,
) => {
  useEffect(() => {
    if (!listState.isFetched && !listState.isFetching) manageList('reset')
  }, [listState.isFetched, listState.isFetching, manageList])
}

export const usePaginatedState = <TItem, TFetchParams>(
  fetchParams: TFetchParams,
  getStateAtom: (param: TFetchParams) => Atom<PaginatedListState<TItem>>,
  getActionAtom: (param: TFetchParams) => WritableAtom<null, [action: PaginationAction], Promise<void>>,
) => {
  const state = useAtomValue(getStateAtom(fetchParams))
  const manageList = useSetAtom(getActionAtom(fetchParams))

  useFetchInitialList(state, manageList)

  return [state, manageList] as const
}

export type PaginatedStateAtom<TItem> = WritableAtom<
  PaginatedListState<TItem>,
  [SetStateAction<PaginatedListState<TItem>>],
  void
>

const handleLoadMore = async <TItem>(
  get: Getter,
  set: Setter,
  paginatedStateAtom: PaginatedStateAtom<TItem>,
  fetchResponse: (params: PaginatedFetchParams) => PaginatedListResponse<TItem> | Promise<PaginatedListResponse<TItem>>,
) => {
  const currentState = get(paginatedStateAtom)

  /**
   * If there is no next index, there is no more data to load
   */
  if (!currentState.data?.nextIndex) return

  set(paginatedStateAtom, (prev) => ({
    ...prev,
    isFetching: true,
    isFetchingNextPage: true,
  }))

  const reponse = await fetchResponse({
    limit: DEFAULT_PAGE_SIZE,
    startIndex: currentState.data.nextIndex,
  })

  set(paginatedStateAtom, (prev) => ({
    ...prev,
    data: { ...reponse, items: [...(prev.data?.items ?? []), ...reponse.items] },
    error: null,
    hasNextPage: reponse.nextIndex !== null,
    isFetched: true,
    isFetching: false,
    isFetchingNextPage: false,
    isRefreshing: false,
  }))
}

const handleRefresh = async <TItem>(
  _get: Getter,
  set: Setter,
  paginatedStateAtom: PaginatedStateAtom<TItem>,
  fetchResponse: (params: PaginatedFetchParams) => PaginatedListResponse<TItem> | Promise<PaginatedListResponse<TItem>>,
) => {
  set(paginatedStateAtom, (prev) => ({
    ...prev,
    isFetching: true,
    isRefreshing: true,
  }))

  const reponse = await fetchResponse({
    limit: DEFAULT_PAGE_SIZE,
    startIndex: 0,
  })

  set(paginatedStateAtom, (prev) => ({
    ...prev,
    data: reponse,
    error: null,
    hasNextPage: reponse.nextIndex !== null,
    isFetched: true,
    isFetching: false,
    isFetchingNextPage: false,
    isRefreshing: false,
  }))
}

export const handlePaginatedStateAtomAction = async <TItem>(
  get: Getter,
  set: Setter,
  action: PaginationAction,
  paginatedStateAtom: PaginatedStateAtom<TItem>,
  fetchResponse: (params: PaginatedFetchParams) => PaginatedListResponse<TItem> | Promise<PaginatedListResponse<TItem>>,
) => {
  try {
    switch (action) {
      case 'loadMore':
        return await handleLoadMore(get, set, paginatedStateAtom, fetchResponse)
      case 'reset':
      case 'refresh':
        return await handleRefresh(get, set, paginatedStateAtom, fetchResponse)
      default:
        assertUnreachable(action)
        return
    }
  } catch (error) {
    set(paginatedStateAtom, (prev) => ({
      ...prev,
      error: error instanceof AppError ? error : new UnknownError(),
      isFetched: true,
      isFetching: false,
      isFetchingNextPage: false,
      isRefreshing: false,
    }))
  }
}

export const makeGetManagePaginatedStateAtom = <TItem, TFetchParams>(
  getAtom: (params: TFetchParams) => PaginatedStateAtom<TItem>,
  fetchResponse: (
    params: PaginatedFetchParams & TFetchParams,
  ) => PaginatedListResponse<TItem> | Promise<PaginatedListResponse<TItem>>,
) =>
  atomFamily(
    (params: TFetchParams) =>
      atom(null, async (get, set, action: PaginationAction) =>
        handlePaginatedStateAtomAction(get, set, action, getAtom(params), (paginatedParams) =>
          fetchResponse({ ...params, ...paginatedParams }),
        ),
      ),
    isEqual,
  )
