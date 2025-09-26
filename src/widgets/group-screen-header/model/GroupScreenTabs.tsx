import { type Href, usePathname } from 'expo-router'
import { useTranslation } from 'react-i18next'

import type { Group } from '@/entities/group'

export const useGroupTabs = (group: Group) => {
  const { t: groupsT } = useTranslation('groups')
  const pathname = usePathname()

  const chatHref: Href = `/groups/${group.id}/chat`
  const membersHref: Href = `/groups/${group.id}/members`
  const myInfoHref: Href = `/groups/${group.id}/my-info`

  return [
    {
      active: pathname === chatHref,
      href: chatHref,
      label: groupsT('tabs.chat.title'),
    },
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
  ]
}
