import { getGroupKnownStatus } from '../lib/attribute-utils'
import { mockGroups } from '../model/mock/groups'
import type {
  Group,
  GroupsListFetchParams,
  GroupsPaginatedListFetchParams,
  GroupsPaginatedListResponse,
} from '../model/types'

const mockFilterGroups = (groups: Group[], params: GroupsListFetchParams) => {
  const filterStatus = (group: Group) => {
    const status = getGroupKnownStatus(group)
    return params.filter?.status === null ? true : status === params.filter?.status
  }

  return groups.filter(filterStatus)
}

export const getGroupsList = async (params: GroupsPaginatedListFetchParams): Promise<GroupsPaginatedListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const filteredGroups = mockFilterGroups(mockGroups, { filter: params.filter })

  const response = {
    items: filteredGroups.slice(params.startIndex, params.startIndex + params.limit),
    nextIndex: filteredGroups.length > params.startIndex + params.limit ? params.startIndex + params.limit : null,
    totalCount: filteredGroups.length,
  }

  return await Promise.resolve(response)
}
