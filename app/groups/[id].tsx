import { BackgroundLayout } from "@/components/BackgroundLayout"
import { InvalidRouteParamsError } from "@/errors/invalid-route-params.error"
import { GroupDetails } from "@/store/group"
import { type ErrorBoundaryProps, Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { Text, View } from "react-native"

/* -------------------------------------------------------------------------------------------------
 * ErrorBoundary
 * -----------------------------------------------------------------------------------------------*/
// FIXME implements
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupScreen
 * -----------------------------------------------------------------------------------------------*/
//  TODO Add loading & error state
export default function GroupScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  if (typeof id !== "string") throw new InvalidRouteParamsError()

  const group = useAtomValue(GroupDetails(id))
  useEffect(() => {
    // router.setop setParams({ name: group.name,  })
  }, [router, group.name])

  return (
    <>
      <BackgroundLayout />

      <Stack.Screen
        options={{
          title: group.name,
        }}
      />

      {/* TODO implement */}
      {group.status === "archived" && <Text>Archived/Paused</Text>}

      <Text>{group.name}</Text>
    </>
  )
}
