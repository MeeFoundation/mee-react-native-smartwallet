import { type ErrorBoundaryProps, useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

import { getGroupAtom, getGroupLink, useGroupView } from '@/entities/group'

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
const GroupScreen = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))
  const groupView = useGroupView(group)

  useEffect(() => {
    router.replace(getGroupLink(groupView))
  }, [groupView, router])

  return null
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupScreen
