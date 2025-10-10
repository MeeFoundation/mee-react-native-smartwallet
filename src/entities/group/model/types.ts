import type { AnySchemaObject } from 'ajv'

import type { Connection } from '@/entities/connection/@x/group'

import type { PaginatedFetchParams, PaginatedListResponse } from '@/shared/model'

export type ShortGroup = {
  id: string
  connections: Connection[]
  schema: AnySchemaObject
  attributes: Record<string, unknown>
}

export type Group = ShortGroup & {
  _short: false // FIXME remove. For now it's used to differentiate between short and full group
}

const KNOWN_GROUP_STATUS = ['active', 'archived'] as const
export type GroupStatus = (typeof KNOWN_GROUP_STATUS)[number]
export const isKnownGroupStatus = (status: unknown): status is GroupStatus =>
  KNOWN_GROUP_STATUS.some((st) => st === status)

export type GroupsFilter = {
  status: GroupStatus | null
}

export type GroupsListFetchParams = {
  filter?: GroupsFilter
}

export type GroupsPaginatedListFetchParams = PaginatedFetchParams & GroupsListFetchParams
export type GroupsPaginatedListResponse = PaginatedListResponse<ShortGroup>
