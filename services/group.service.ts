import type { Group } from "@/models/group"
import { mockGroups } from "@/services/mockData/groups"

export type GroupFilter = {
  status: Group["status"] | null
}

export const defaultGroupFilter: GroupFilter = {
  status: "active",
}

export const emptyGroupFilter: GroupFilter = {
  status: null,
}

export const filterGroups = (groups: Group[], filter: GroupFilter) => {
  const filterStatus = (group: Group) =>
    filter.status === null ? true : group.status === filter.status

  return groups.filter(filterStatus)
}

class GroupService {
  async getGroupDetails(id: string): Promise<Group> {
    const group = mockGroups.find((g) => g.id === id)
    if (!group) {
      throw new Error("Group not found")
    }

    return await Promise.resolve(group)
  }

  async getGroups(): Promise<Group[]> {
    return await Promise.resolve(mockGroups)
  }
}

export const groupService = new GroupService()
