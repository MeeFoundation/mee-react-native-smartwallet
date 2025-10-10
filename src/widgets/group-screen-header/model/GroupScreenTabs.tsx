import { type Href, usePathname } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { type GroupView, getGroupChatLink, getGroupMembersLink, getGroupMyInfoLink } from '@/entities/group'

type GroupTab = {
  active: boolean
  href: Href
  label: string
}

export const useGroupTabs = (group: GroupView): GroupTab[] => {
  const { t: groupsT } = useTranslation('groups')
  const pathname = usePathname()

  const chatHref = getGroupChatLink(group)
  const membersHref = getGroupMembersLink(group)
  const myInfoHref = getGroupMyInfoLink(group)

  return [
    chatHref
      ? {
          active: pathname === chatHref,
          href: chatHref,
          label: groupsT('tabs.chat.title'),
        }
      : null,
    {
      active: pathname === membersHref,
      href: membersHref,
      label: groupsT('tabs.members.title'),
    },
    {
      active: pathname === myInfoHref,
      href: myInfoHref,
      label: groupsT('tabs.myInfo.title'),
    },
  ].filter((val) => !!val)
}
