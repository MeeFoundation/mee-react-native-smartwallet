import { type ErrorBoundaryProps, useLocalSearchParams } from 'expo-router'
import { useAtomValue } from 'jotai'
import { Text, View } from 'react-native'

import { GroupScreenHeader, GroupScreenTabs } from '@/widgets/group-screen-header'
import { ScreenLayout } from '@/widgets/navigation'

import { getGroupAtom } from '@/entities/group'

import { InvalidRouteParamsError } from '@/shared/errors'

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
 * GroupScreen
 * -----------------------------------------------------------------------------------------------*/
//  TODO Add loading & error state
export default function GroupMembersScreen() {
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))

  return (
    <ScreenLayout.Root>
      <GroupScreenHeader group={group} />

      <GroupScreenTabs group={group} />

      <ScreenLayout.Content className="px-2">
        <Text>Members</Text>
      </ScreenLayout.Content>
    </ScreenLayout.Root>
  )
}

/* -----------------------------------------------------------------------------------------------*/
