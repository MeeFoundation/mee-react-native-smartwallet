import type { Connection } from "@/entities/connection/@x/person"
import type { PaginatedFetchParams, PaginatedListResponse } from "@/shared/model"

export type ShortPerson = Connection
export type Person = ShortPerson

export type PersonsFilter = {
  connectionStatus?: Connection["status"] | null
  has?: ("email" | "password" | "phone" | "payment_details")[]
}

export type PersonsListFetchParams = {
  filter?: PersonsFilter
}

export type PersonsPaginatedListFetchParams = PaginatedFetchParams & PersonsListFetchParams
export type PersonsPaginatedListResponse = PaginatedListResponse<ShortPerson>
