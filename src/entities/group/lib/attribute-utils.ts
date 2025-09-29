import { type GroupStatus, isKnownGroupStatus, type ShortGroup } from '../model/types'

export const getGroupKnownStatus = (group: ShortGroup): GroupStatus | undefined => {
  const status = group.attributes.status
  return isKnownGroupStatus(status) ? status : undefined
}

// FIXME remove number from typings
export const getGroupThumbnail = (group: ShortGroup): string | number | undefined => {
  const thumbnail = group.attributes.thumbnail
  return typeof thumbnail === 'string' || typeof thumbnail === 'number' ? thumbnail : undefined
}

export const getGroupName = (group: ShortGroup): string | undefined => {
  const name = group.attributes.name
  return typeof name === 'string' ? name : undefined
}

export const getGroupHasChat = (group: ShortGroup): boolean => {
  return !!group.attributes.chat
}
