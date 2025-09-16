import type { AppError } from "@/errors/app-error"
import type { IndexPaginationResponse } from "@/models/api"

export type PaginationAction = "loadMore" | "refresh" | "reset"

export type PaginatedListState<TItem> = {
  hasNextPage: boolean
  isRefreshing: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
  isFetched: boolean
  data: IndexPaginationResponse<TItem> | null
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
