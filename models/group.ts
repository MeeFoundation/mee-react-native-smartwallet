import type { Connection } from "@/models/connection"
import type { ImageRequireSource } from "react-native"
import type { PaginatedFetchParams, PaginatedListResponse } from "./api"

export type ShortGroup = {
  id: string
  name: string
  status: "active" | "archived"
  iconSrc?: ImageRequireSource | string
  connections: Connection[]
}

export type Group = ShortGroup

export type GroupsFilter = {
  status: Group["status"] | null
}

export type GroupsListFetchParams = {
  filter?: GroupsFilter
}

export type GroupsPaginatedListFetchParams = PaginatedFetchParams & GroupsListFetchParams
export type GroupsPaginatedListResponse = PaginatedListResponse<ShortGroup>
