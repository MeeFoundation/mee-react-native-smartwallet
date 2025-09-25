import { type ErrorBoundaryProps, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

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

  useEffect(() => {
    router.replace(`/groups/${id}/chat`)
  }, [id, router])

  return null
}

/* -----------------------------------------------------------------------------------------------*/

export default GroupScreen
