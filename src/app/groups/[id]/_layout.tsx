import type { Group } from "@/entities/group"
import { getGroupAtom } from "@/entities/group"
import { colors, fonts } from "@/shared/config"
import { InvalidRouteParamsError } from "@/shared/errors"
import { Avatar } from "@/shared/ui/Avatar"
import { BackgroundLayout } from "@/shared/ui/BackgroundLayout"
import { HeaderBackButtonMinimal } from "@/shared/ui/HeaderBackButton"
import { IconSymbol } from "@/shared/ui/IconSymbol"
import { ScreenTitle } from "@/shared/ui/ScreenTitle"
import { Typography } from "@/shared/ui/Typography"
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

  const chatHref: Href = `/groups/${group.id}/chat`
  const membersHref: Href = `/groups/${group.id}/members`
  const myInfoHref: Href = `/groups/${group.id}/my-info`

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

  const group = useAtomValue(getGroupAtom(id))

  // TODO add loading & error state
  return <GroupLayoutContent group={group} />
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupLayout
