import type { IndexPaginationRequest, IndexPaginationResponse } from "@/models/api"
import type { Group } from "@/models/group"
import { mockGroups } from "@/services/mockData/groups"

export type GroupFilter = {
  status: Group["status"] | null
}

export type GroupsParams = {
  filter?: GroupFilter
}

export const defaultGroupFilter: GroupFilter = {
  status: "active",
}

export const emptyGroupFilter: GroupFilter = {
  status: null,
}

export const filterGroups = (groups: Group[], params: GroupsParams) => {
  const filterStatus = (group: Group) =>
    params.filter?.status === null ? true : group.status === params.filter?.status

  return groups.filter(filterStatus)
}

export type GroupsIndexPaginationRequest = IndexPaginationRequest & GroupsParams

export type GroupsIndexPaginatedResponse = IndexPaginationResponse<Group>

class GroupsService {
  async getGroupDetails(id: string): Promise<Group> {
    const group = mockGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error("Group not found")
    }

    return await Promise.resolve(group)
  }

  async getGroups(params: GroupsIndexPaginationRequest): Promise<GroupsIndexPaginatedResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const filteredGroups = filterGroups(mockGroups, { filter: params.filter })

    const response = {
      items: filteredGroups.slice(params.startIndex, params.startIndex + params.limit),
      nextIndex:
        filteredGroups.length > params.startIndex + params.limit
          ? params.startIndex + params.limit
          : null,
      totalCount: filteredGroups.length,
    }

    return await Promise.resolve(response)
  }
}

export const groupsService = new GroupsService()
