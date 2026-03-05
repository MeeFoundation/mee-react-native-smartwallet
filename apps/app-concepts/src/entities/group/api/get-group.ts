import { mockGroups } from '../model/mock/groups'
import type { Group } from '../model/types'

export const getGroup = async (id: string): Promise<Group> => {
  const group = mockGroups.find((g) => g.id === id)
  if (!group) throw new Error('Group not found')
  return await Promise.resolve(group)
}
