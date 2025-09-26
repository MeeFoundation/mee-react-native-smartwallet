import { type Href, usePathname, useRouter } from 'expo-router'
import { type FC, useCallback } from 'react'
import { type GestureResponderEvent, TouchableOpacity, type TouchableOpacityProps, View } from 'react-native'

import type { Group } from '@/entities/group'

import { colors } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { Typography } from '@/shared/ui/Typography'

import { useGroupTabs } from '../model/GroupScreenTabs'

/* -------------------------------------------------------------------------------------------------
 * GroupScreenTab
 * -----------------------------------------------------------------------------------------------*/
type GroupScreenTabProps = TouchableOpacityProps & {
  href?: Href
  active?: boolean
}

const GroupScreenTab: FC<GroupScreenTabProps> = (props) => {
  const { active, children, href, onPress, ...rest } = props
  const router = useRouter()

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (href) router.replace(href)
      onPress?.(event)
    },
    [onPress, href, router],
  )

  return (
    <TouchableOpacity
      className={cn('h-10 items-center justify-center rounded-md px-4 py-2', active && 'bg-white')}
      style={[
        { flex: 1 },
        active && { boxShadow: `0px 1px 2px 0px ${colors['black/05']}, 0px 1px 3px 0px ${colors['black/10']}` },
      ]}
      {...rest}
      onPress={handlePress}
    >
      <View>
        <Typography className="font-medium">{children}</Typography>
      </View>
    </TouchableOpacity>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupScreenTabs
 * -----------------------------------------------------------------------------------------------*/
type GroupScreenTabsProps = {
  group: Group
}

const GroupScreenTabs: FC<GroupScreenTabsProps> = ({ group }) => {
  const pathname = usePathname()
  const tabs = useGroupTabs(group)

  return (
    <View className="flex-row border-b border-b-black/10 bg-black/5 p-1.5">
      {tabs.map((tab) => (
        <GroupScreenTab active={pathname === tab.href} href={tab.href} key={tab.label}>
          {tab.label}
        </GroupScreenTab>
      ))}
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { GroupScreenTabs }

export type { GroupScreenTabsProps }
