import { Stack, useLocalSearchParams, usePathname, useRouter, type Href } from "expo-router"
import { useAtomValue } from "jotai"
import { useCallback, type FC } from "react"
import { useTranslation } from "react-i18next"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
  type TouchableOpacityProps,
} from "react-native"

import { colors } from "@/constants/colors"
import { fonts } from "@/constants/fonts"

import { Avatar } from "@/components/Avatar"
import { BackgroundLayout } from "@/components/BackgroundLayout"
import { HeaderBackButtonMinimal } from "@/components/HeaderBackButton"
import { ScreenTitle } from "@/components/ScreenTitle"
import { Typography } from "@/components/Typography"

import { InvalidRouteParamsError } from "@/errors/invalid-route-params.error"

import type { Group } from "@/models/group"

import { GroupDetails } from "@/store/groups"

import { IconSymbol } from "@/components/IconSymbol"
import {
  getGroupChatScreenLink,
  getGroupMemebersScreenLink,
  getGroupMyInfoScreenLink,
} from "@/utils/links"

const styles = StyleSheet.create({
  tabsHolder: {
    backgroundColor: colors["black/05"],
    borderBottomColor: colors["black/10"],
    borderBottomWidth: 1,
    padding: 6,
    flexDirection: "row",
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    boxShadow: `0px 1px 2px 0px ${colors["black/05"]}, 0px 1px 3px 0px ${colors["black/10"]}`,
  },
  tabButtonText: {
    fontSize: 16,
    color: colors["gray-900"],
  },

  stackContainer: {
    flex: 1,
    padding: 8,
  },

  headerRightButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
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
        <Typography weight="500" fontFamily={fonts.publicSans.medium} style={styles.tabButtonText}>
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
  const { t: groupsT } = useTranslation("groups")
  const pathname = usePathname()

  const chatHref = getGroupChatScreenLink(group)
  const membersHref = getGroupMemebersScreenLink(group)
  const myInfoHref = getGroupMyInfoScreenLink(group)

  return [
    {
      label: groupsT("tabs.chat.title"),
      href: chatHref,
      active: pathname === chatHref,
    },
    {
      label: groupsT("tabs.members.title"),
      href: membersHref,
      active: pathname === membersHref,
    },
    {
      label: groupsT("tabs.myInfo.title"),
      href: myInfoHref,
      active: pathname === myInfoHref,
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
        <GroupScreenTab key={tab.label} href={tab.href} active={pathname === tab.href}>
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
        title: group.name,
        headerTitle: () => (
          <ScreenTitle thumbnail={<Avatar src={group.iconSrc} text={group.name} size={28} />}>
            {group.name}
          </ScreenTitle>
        ),
        // FIXME  Add a proper header right component
        headerRight: () => (
          <TouchableOpacity style={styles.headerRightButton}>
            <IconSymbol
              name="ellipsis-vertical.outlined"
              strokeWidth={2}
              color={colors["blue-700"]}
            />
          </TouchableOpacity>
        ),
        headerLeft: () => <HeaderBackButtonMinimal color={colors["blue-700"]} />,
      }}
    />

    <GroupScreenTabs group={group} />

    <View style={styles.stackContainer}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: { backgroundColor: "transparent" },
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
  if (typeof id !== "string") throw new InvalidRouteParamsError()

  const group = useAtomValue(GroupDetails(id))

  // TODO add loading & error state
  return <GroupLayoutContent group={group} />
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupLayout
