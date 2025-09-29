import { getGroupKnownStatus } from '../lib/attribute-utils'
import { mockGroups } from './mock/groups'
import type {
  Group,
  GroupsFilter,
  GroupsListFetchParams,
  GroupsPaginatedListFetchParams,
  GroupsPaginatedListResponse,
} from './types'

export const defaultGroupFilter: GroupsFilter = {
  status: 'active',
}

export const emptyGroupFilter: GroupsFilter = {
  status: null,
}

export const mockFilterGroups = (groups: Group[], params: GroupsListFetchParams) => {
  const filterStatus = (group: Group) => {
    const status = getGroupKnownStatus(group)
    return params.filter?.status === null ? true : status === params.filter?.status
  }

  return groups.filter(filterStatus)
}

class GroupsService {
  async getGroupDetails(id: string): Promise<Group> {
    const group = mockGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error('Group not found')
    }

    return await Promise.resolve(group)
  }

  async getGroups(params: GroupsPaginatedListFetchParams): Promise<GroupsPaginatedListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const filteredGroups = mockFilterGroups(mockGroups, { filter: params.filter })

    const response = {
      items: filteredGroups.slice(params.startIndex, params.startIndex + params.limit),
      nextIndex: filteredGroups.length > params.startIndex + params.limit ? params.startIndex + params.limit : null,
      totalCount: filteredGroups.length,
    }

    return await Promise.resolve(response)
  }
}

export const groupsService = new GroupsService()
