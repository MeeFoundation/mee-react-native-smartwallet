import type { ImageRequireSource } from 'react-native'

import type { Connection } from '@/entities/connection/@x/group'

import type { PaginatedFetchParams, PaginatedListResponse } from '@/shared/model'

export type ShortGroup = {
  id: string
  name: string
  status: 'active' | 'archived'
  iconSrc?: ImageRequireSource | string
  connections: Connection[]
}

export type Group = ShortGroup

export type GroupsFilter = {
  status: Group['status'] | null
}

export type GroupsListFetchParams = {
  filter?: GroupsFilter
}

export type GroupsPaginatedListFetchParams = PaginatedFetchParams & GroupsListFetchParams
export type GroupsPaginatedListResponse = PaginatedListResponse<ShortGroup>
