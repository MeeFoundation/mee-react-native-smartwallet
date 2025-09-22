import { getGroupAtom } from "@/entities/group"
import { InvalidRouteParamsError } from "@/shared/errors"
import { type ErrorBoundaryProps, useLocalSearchParams } from "expo-router"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 8,
  },
})

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
 * GroupMyInfoScreen
 * -----------------------------------------------------------------------------------------------*/
//  TODO Add loading & error state
export default function GroupMyInfoScreen() {
  const { id } = useLocalSearchParams()
  if (typeof id !== "string") throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))

  return (
    <>
      <View style={styles.page}>
        <Text>My Info: {group.name}</Text>
      </View>
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/
