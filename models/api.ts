export type IndexPaginationRequest = {
  startIndex: number
  limit: number
}

export type IndexPaginationResponse<TItem> = {
  items: TItem[]
  nextIndex: number | null
  totalCount?: number
}
