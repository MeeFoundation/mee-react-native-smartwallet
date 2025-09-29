import { type ErrorBoundaryProps, type Href, useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import { type FC, Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type GestureResponderEvent, Text, TouchableOpacity, type TouchableOpacityProps, View } from 'react-native'

import { UserTitle } from '@/widgets/group-my-info'
import { GroupScreenHeader, GroupScreenTabs } from '@/widgets/group-screen-header'
import { LoadingScreen, ScreenLayout } from '@/widgets/navigation'

import {
  type Group,
  getGroupAtom,
  getGroupMyInfoAvailabilityCalendarLink,
  getGroupMyInfoDocumentsLink,
  getGroupMyInfoHealthLink,
  getGroupMyInfoPersonalDetailsLink,
  getMyGroupPersonalDetailsViewAtom,
  useGroupView,
} from '@/entities/group'

import { InvalidRouteParamsError } from '@/shared/errors'
import { cn } from '@/shared/lib/cn'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * ErrorBoundary
 * -----------------------------------------------------------------------------------------------*/
// FIXME implements
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ backgroundColor: 'red', flex: 1 }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SectionLink
 * -----------------------------------------------------------------------------------------------*/
type SectionLinkProps = TouchableOpacityProps & { href: Href }

const SectionLink: FC<SectionLinkProps> = ({ className, children, href, onPress, ...rest }) => {
  const router = useRouter()

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      router.push(href)
      onPress?.(event)
    },
    [href, router, onPress],
  )

  return (
    <TouchableOpacity
      {...rest}
      className={cn(
        'h-11 flex-row items-center justify-between rounded-xl border border-black/5 bg-white/50 px-3 py-2.5',
        className,
      )}
      onPress={handlePress}
    >
      <View>
        <Typography className="font-semibold text-base">{children}</Typography>
      </View>

      <View className="h-5 w-5">
        <IconSymbol name="chevron-right.outlined" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupMyInfoScreenContent
 * -----------------------------------------------------------------------------------------------*/
const useSections = (group: Group) => {
  const { t: groupsT } = useTranslation('groups')

  return useMemo(
    () =>
      [
        {
          children: groupsT('my_info_tabs.personal_details.title'),
          href: getGroupMyInfoPersonalDetailsLink(group),
        },
        {
          children: groupsT('my_info_tabs.availability_calendar.title'),
          href: getGroupMyInfoAvailabilityCalendarLink(group),
        },
        { children: groupsT('my_info_tabs.health.title'), href: getGroupMyInfoHealthLink(group) },
        { children: groupsT('my_info_tabs.documents.title'), href: getGroupMyInfoDocumentsLink(group) },
      ] as const,
    [groupsT, group],
  )
}

type GroupMyInfoScreenContentProps = {
  groupId: string
}

const GroupMyInfoScreenContent: FC<GroupMyInfoScreenContentProps> = ({ groupId }) => {
  const group = useAtomValue(getGroupAtom(groupId))
  const groupView = useGroupView(group)
  const sections = useSections(group)
  const myGroupPersonalDetailsView = useAtomValue(getMyGroupPersonalDetailsViewAtom(group.id))

  const subtitle = useMemo(
    () =>
      [myGroupPersonalDetailsView.isAdmin && 'Admin', myGroupPersonalDetailsView.status].filter(Boolean).join(' • '),
    [myGroupPersonalDetailsView.isAdmin, myGroupPersonalDetailsView.status],
  )

  return (
    <ScreenLayout.Root>
      <GroupScreenHeader group={groupView} />
      <GroupScreenTabs group={groupView} />

      <ScreenLayout.Content className="px-2">
        <UserTitle
          // FIXME handle unknown
          displayName={myGroupPersonalDetailsView.displayName ?? 'Unknown'}
          subtitle={subtitle}
          thumbnail={myGroupPersonalDetailsView.thumbnail}
        />

        <View className="gap-2">
          {sections.map((section) => (
            <SectionLink href={section.href} key={String(section.href)}>
              {section.children}
            </SectionLink>
          ))}
        </View>
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupMyInfoScreen
 * -----------------------------------------------------------------------------------------------*/
const GroupMyInfoScreen: FC = () => {
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  return (
    <Suspense fallback={<LoadingScreen />}>
      <GroupMyInfoScreenContent groupId={id} />
    </Suspense>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupMyInfoScreen
