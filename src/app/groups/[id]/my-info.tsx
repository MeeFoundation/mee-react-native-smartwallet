import { type ErrorBoundaryProps, useLocalSearchParams } from 'expo-router'
import { useAtomValue } from 'jotai'
import { ScrollView, Text, View } from 'react-native'

import { GroupMyInfo } from '@/widgets/group-my-info'

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
 * GroupMyInfoScreen
 * -----------------------------------------------------------------------------------------------*/
//  TODO Add loading & error state
export default function GroupMyInfoScreen() {
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))

  return (
    <ScrollView>
      <GroupMyInfo group={group} />
    </ScrollView>
  )
}

/* -----------------------------------------------------------------------------------------------*/
