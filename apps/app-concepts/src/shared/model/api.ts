export type PaginatedFetchParams = {
  startIndex: number
  limit: number
}

export type PaginatedListResponse<TItem> = {
  items: TItem[]
  nextIndex: number | null
  totalCount?: number
}
