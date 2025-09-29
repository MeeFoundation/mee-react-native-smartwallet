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

export const getDisplayName = (attributes: Record<string, unknown>): string | undefined => {
  return typeof attributes.display_name === 'string' ? attributes.display_name : undefined
}

export const getStatus = (attributes: Record<string, unknown>): string | undefined => {
  return typeof attributes.status === 'string' ? attributes.status : undefined
}

export const getIsAdmin = (attributes: Record<string, unknown>): boolean => {
  return !!attributes.is_admin
}

export const getThumbnail = (attributes: Record<string, unknown>): string | undefined => {
  return typeof attributes.thumbnail === 'string' ? attributes.thumbnail : undefined
}
