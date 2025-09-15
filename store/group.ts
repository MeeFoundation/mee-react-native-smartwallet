import type { Group } from "@/models/group"
import { defaultGroupFilter, type GroupFilter, groupService } from "@/services/group.service"
import { atom } from "jotai"
import { atomFamily, atomWithDefault } from "jotai/utils"

export const groupFilterAtom = atomWithDefault<GroupFilter>(() => defaultGroupFilter)

export const groupsStore = atomWithDefault<Group[] | Promise<Group[]>>(
  async () => await groupService.getGroups(),
)

export const GroupDetails = atomFamily((id: string) =>
  atom(
    async (get) => {
      const groups = await get(groupsStore)
      const group = groups.find((g) => g.id === id)
      if (!group) {
        console.error(`Group with id ${id} not found`)
      }
      return group!
    },
    async (get, set, group: Group) => {
      const groups = await get(groupsStore)
      const updatedGroups = groups.map((g) => (g.id === group.id ? group : g))
      set(groupsStore, updatedGroups)
    },
  ),
)
