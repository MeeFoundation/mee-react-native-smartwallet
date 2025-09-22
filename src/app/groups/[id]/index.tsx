import { getGroupAtom } from "@/entities/group"
import { colors } from "@/shared/config"
import { InvalidRouteParamsError } from "@/shared/errors"
import { AppButton } from "@/shared/ui/AppButton"
import { Avatar } from "@/shared/ui/Avatar"
import { BackgroundLayout } from "@/shared/ui/BackgroundLayout"
import * as DropdownMenu from "@/shared/ui/DropdownMenu"
import { HeaderBackButtonMinimal } from "@/shared/ui/HeaderBackButton"
import { IconSymbol } from "@/shared/ui/IconSymbol"
import { ScreenTitle } from "@/shared/ui/ScreenTitle"
import { StatusPanel } from "@/shared/ui/StatusPanel"
import { type ErrorBoundaryProps, Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
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
 * HeaderRight
 * -----------------------------------------------------------------------------------------------*/
const HeaderRight = () => {
  const handleRenameGroup = useCallback(() => {
    throw new Error("Not implemented")
  }, [])

  const handleArchiveGroup = useCallback(() => {
    throw new Error("Not implemented")
  }, [])

  const handleDeleteGroup = useCallback(() => {
    throw new Error("Not implemented")
  }, [])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.MenuTrigger>
        <AppButton variant="link">
          <IconSymbol
            strokeWidth={2}
            color={colors["blue-700"]}
            name="ellipsis-vertical.outlined"
          />
        </AppButton>
      </DropdownMenu.MenuTrigger>

      <DropdownMenu.MenuContent>
        {/* Rename group */}
        <DropdownMenu.MenuItem
          key="rename-group"
          onSelect={handleRenameGroup}
          textValue="Rename Group"
          color={colors.danger}
        >
          <DropdownMenu.MenuItemTitle>
            <Text style={{ color: colors.danger }}>Rename Group</Text>
          </DropdownMenu.MenuItemTitle>
        </DropdownMenu.MenuItem>

        {/* Archive/unarchive group */}
        <DropdownMenu.MenuItem
          key="archive-group"
          onSelect={handleArchiveGroup}
          textValue="Archive Group"
          color={colors.danger}
        >
          <DropdownMenu.MenuItemTitle>
            <Text style={{ color: colors.danger }}>Archive Group</Text>
          </DropdownMenu.MenuItemTitle>
        </DropdownMenu.MenuItem>

        {/* <DropdownMenu.MenuSeparator /> */}

        {/* Delete group */}
        <DropdownMenu.MenuItem
          destructive
          key="delete-group"
          onSelect={handleDeleteGroup}
          textValue="Delete Group"
          color={colors.danger}
        >
          <DropdownMenu.MenuItemTitle>
            <Text style={{ color: colors.danger }}>Delete Group</Text>
          </DropdownMenu.MenuItemTitle>
        </DropdownMenu.MenuItem>
      </DropdownMenu.MenuContent>
    </DropdownMenu.Root>
  )
}

/* -------------------------------------------------------------------------------------------------
 * GroupScreen
 * -----------------------------------------------------------------------------------------------*/
//  TODO Add loading & error state
export default function GroupScreen() {
  const { id } = useLocalSearchParams()

  if (typeof id !== "string") throw new InvalidRouteParamsError()

  const router = useRouter()

  const group = useAtomValue(getGroupAtom(id))
  useEffect(() => {
    // router.setop setParams({ name: group.name,  })
  }, [router, group.name])

  return (
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
          headerRight: () => <HeaderRight />,
          headerLeft: () => <HeaderBackButtonMinimal color={colors["blue-700"]} />,
        }}
      />

      <View style={styles.page}>
        {group.status === "archived" && (
          <StatusPanel
            variant="danger"
            title="This group is archived and paused"
            description="The data below is visible to you only."
          />
        )}

        <Text>{group.name}</Text>
      </View>
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/
