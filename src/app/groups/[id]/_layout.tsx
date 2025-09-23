import { type Href, Stack, useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import { type FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from 'react-native'

import type { Group } from '@/entities/group'
import { getGroupAtom } from '@/entities/group'

import { colors, fonts } from '@/shared/config'
import { InvalidRouteParamsError } from '@/shared/errors'
import { Avatar } from '@/shared/ui/Avatar'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import { HeaderBackButtonMinimal } from '@/shared/ui/HeaderBackButton'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { ScreenTitle } from '@/shared/ui/ScreenTitle'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  headerRightButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },

  stackContainer: {
    flex: 1,
    padding: 8,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    boxShadow: `0px 1px 2px 0px ${colors['black/05']}, 0px 1px 3px 0px ${colors['black/10']}`,
  },
  tabButtonText: {
    color: colors['gray-900'],
    fontSize: 16,
  },
  tabsHolder: {
    backgroundColor: colors['black/05'],
    borderBottomColor: colors['black/10'],
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 6,
  },
})

/* -------------------------------------------------------------------------------------------------
 * GroupScreenTab
 * -----------------------------------------------------------------------------------------------*/
type GroupScreenTabProps = TouchableOpacityProps & {
  href?: Href
  active?: boolean
}

const GroupScreenTab: FC<GroupScreenTabProps> = (props) => {
  const { style, active, children, href, onPress, ...rest } = props
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
      style={[styles.tabButton, active && styles.tabButtonActive, style]}
      {...rest}
      onPress={handlePress}
    >
      <View>
        <Typography fontFamily={fonts.publicSans.medium} style={styles.tabButtonText} weight="500">
          {children}
        </Typography>
      </View>
    </TouchableOpacity>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupScreenTabs
 * -----------------------------------------------------------------------------------------------*/
const useGroupTabs = (group: Group) => {
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

type GroupScreenTabsProps = {
  group: Group
}

const GroupScreenTabs: FC<GroupScreenTabsProps> = ({ group }) => {
  const pathname = usePathname()
  const tabs = useGroupTabs(group)

  return (
    <View style={styles.tabsHolder}>
      {tabs.map((tab) => (
        <GroupScreenTab active={pathname === tab.href} href={tab.href} key={tab.label}>
          {tab.label}
        </GroupScreenTab>
      ))}
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupLayout
 * -----------------------------------------------------------------------------------------------*/
type GroupLayoutContentProps = {
  group: Group
}

const GroupLayoutContent: FC<GroupLayoutContentProps> = ({ group }) => (
  <>
    <BackgroundLayout />

    <Stack.Screen
      options={{
        headerLeft: () => <HeaderBackButtonMinimal color={colors['blue-700']} />,
        // FIXME  Add a proper header right component
        headerRight: () => (
          <TouchableOpacity style={styles.headerRightButton}>
            <IconSymbol color={colors['blue-700']} name="ellipsis-vertical.outlined" strokeWidth={2} />
          </TouchableOpacity>
        ),
        headerTitle: () => (
          <ScreenTitle thumbnail={<Avatar size={28} src={group.iconSrc} text={group.name} />}>{group.name}</ScreenTitle>
        ),
        title: group.name,
      }}
    />

    <GroupScreenTabs group={group} />

    <View style={styles.stackContainer}>
      <Stack
        screenOptions={{
          animation: 'none',
          contentStyle: { backgroundColor: 'transparent' },
          headerShown: false,
        }}
      />
    </View>
  </>
)

/* -------------------------------------------------------------------------------------------------
 * GroupLayout
 * -----------------------------------------------------------------------------------------------*/
const GroupLayout: FC = () => {
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))

  // TODO add loading & error state
  return <GroupLayoutContent group={group} />
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupLayout
