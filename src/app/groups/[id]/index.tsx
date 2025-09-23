import { type ErrorBoundaryProps, Stack, useLocalSearchParams } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { getGroupAtom } from '@/entities/group'

import { colors } from '@/shared/config'
import { InvalidRouteParamsError } from '@/shared/errors'
import { AppButton } from '@/shared/ui/AppButton'
import { Avatar } from '@/shared/ui/Avatar'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import * as DropdownMenu from '@/shared/ui/DropdownMenu'
import { HeaderBackButtonMinimal } from '@/shared/ui/HeaderBackButton'
import { IconSymbol } from '@/shared/ui/IconSymbol'
import { ScreenTitle } from '@/shared/ui/ScreenTitle'
import { StatusPanel } from '@/shared/ui/StatusPanel'

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
    <View style={{ backgroundColor: 'red', flex: 1 }}>
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
    throw new Error('Not implemented')
  }, [])

  const handleArchiveGroup = useCallback(() => {
    throw new Error('Not implemented')
  }, [])

  const handleDeleteGroup = useCallback(() => {
    throw new Error('Not implemented')
  }, [])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.MenuTrigger>
        <AppButton variant="link">
          <IconSymbol color={colors['blue-700']} name="ellipsis-vertical.outlined" strokeWidth={2} />
        </AppButton>
      </DropdownMenu.MenuTrigger>

      <DropdownMenu.MenuContent>
        {/* Rename group */}
        <DropdownMenu.MenuItem
          color={colors.danger}
          key="rename-group"
          onSelect={handleRenameGroup}
          textValue="Rename Group"
        >
          <DropdownMenu.MenuItemTitle>
            <Text style={{ color: colors.danger }}>Rename Group</Text>
          </DropdownMenu.MenuItemTitle>
        </DropdownMenu.MenuItem>

        {/* Archive/unarchive group */}
        <DropdownMenu.MenuItem
          color={colors.danger}
          key="archive-group"
          onSelect={handleArchiveGroup}
          textValue="Archive Group"
        >
          <DropdownMenu.MenuItemTitle>
            <Text style={{ color: colors.danger }}>Archive Group</Text>
          </DropdownMenu.MenuItemTitle>
        </DropdownMenu.MenuItem>

        {/* <DropdownMenu.MenuSeparator /> */}

        {/* Delete group */}
        <DropdownMenu.MenuItem
          color={colors.danger}
          destructive
          key="delete-group"
          onSelect={handleDeleteGroup}
          textValue="Delete Group"
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

  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const group = useAtomValue(getGroupAtom(id))

  return (
    <>
      <BackgroundLayout />

      <Stack.Screen
        options={{
          headerLeft: () => <HeaderBackButtonMinimal color={colors['blue-700']} />,
          headerRight: () => <HeaderRight />,
          headerTitle: () => (
            <ScreenTitle thumbnail={<Avatar size={28} src={group.iconSrc} text={group.name} />}>
              {group.name}
            </ScreenTitle>
          ),
          title: group.name,
        }}
      />

      <View style={styles.page}>
        {group.status === 'archived' && (
          <StatusPanel
            description="The data below is visible to you only."
            title="This group is archived and paused"
            variant="danger"
          />
        )}

        <Text>{group.name}</Text>
      </View>
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/
