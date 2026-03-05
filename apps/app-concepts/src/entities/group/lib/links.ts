import type { Href } from 'expo-router'

import { ShortGroupView } from '../model/short-group.view'
import type { ShortGroup } from '../model/types'
import { getGroupHasChat } from './attribute-utils'

export const getGroupChatLink = (group: ShortGroup | ShortGroupView): Href | null => {
  const hasChat = group instanceof ShortGroupView ? group.hasChat : getGroupHasChat(group)
  return hasChat ? `/groups/${group.id}/chat` : null
}

export const getGroupMembersLink = (group: ShortGroup | ShortGroupView): Href => `/groups/${group.id}/members`
export const getGroupMyInfoLink = (group: ShortGroup | ShortGroupView): Href => `/groups/${group.id}/my-info`

export const getGroupMyInfoPersonalDetailsLink = (group: ShortGroup | ShortGroupView): Href =>
  `/groups/${group.id}/my-info/personal-details`

export const getGroupMyInfoAvailabilityCalendarLink = (group: ShortGroup | ShortGroupView): Href =>
  `/groups/${group.id}/my-info/availability-calendar`

export const getGroupMyInfoHealthLink = (group: ShortGroup | ShortGroupView): Href =>
  `/groups/${group.id}/my-info/health`

export const getGroupMyInfoDocumentsLink = (group: ShortGroup | ShortGroupView): Href =>
  `/groups/${group.id}/my-info/documents`

export const getGroupLink = (group: ShortGroup | ShortGroupView): Href =>
  getGroupChatLink(group) ?? getGroupMembersLink(group)
