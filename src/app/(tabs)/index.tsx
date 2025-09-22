import type BottomSheet from '@gorhom/bottom-sheet'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { range } from 'lodash-es'
import { type FC, Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, StyleSheet, Text, View, type ViewProps } from 'react-native'

import {
  emptyGroupFilter,
  FilterGroups,
  GroupListCard,
  GroupListCardSkeleton,
  type GroupsFilter,
  type GroupsListFetchParams,
  getManagePaginatedGroupsListAtom,
  getPaginatedGroupsListStateAtom,
  groupFilterAtom,
  type ShortGroup,
} from '@/entities/group'

import { colors } from '@/shared/config'
import type { AppError } from '@/shared/errors'
import { usePaginatedState } from '@/shared/lib/paginated-list'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import { BottomSheetBackDrop } from '@/shared/ui/BottomSheet'
import { FiltersSelectButton } from '@/shared/ui/FiltersSelectButton'
import * as ListLayout from '@/shared/ui/ListLayout'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  filterButtonText: {
    fontWeight: 500,
  },
  listSeparator: {
    height: 8,
  },
  loadingView: {
    paddingTop: 8,
  },
  sectionContainer: {
    flex: 1,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ListSeparator
 * -----------------------------------------------------------------------------------------------*/
const ListSeparator: FC = () => <View style={styles.listSeparator} />

/* -------------------------------------------------------------------------------------------------
 * GroupsListErrorView
 * -----------------------------------------------------------------------------------------------*/
type GroupsListErrorProps = {
  error: AppError
}

// TODO implement error view´
const GroupsListErrorView: FC<GroupsListErrorProps> = () => <Text>Error</Text>

/* -------------------------------------------------------------------------------------------------
 * GroupsLoadingView
 * -----------------------------------------------------------------------------------------------*/
type GroupsLoadingViewProps = Omit<ViewProps, 'children'> & {
  isFetchingNextPage: boolean
}

const PENDING_GROUPS_COUNT = 6

const GroupsLoadingView: FC<GroupsLoadingViewProps> = ({ isFetchingNextPage, style, ...rest }) =>
  !isFetchingNextPage ? null : (
    <View style={[styles.loadingView, style]} {...rest}>
      {range(PENDING_GROUPS_COUNT).map((index) => (
        <Fragment key={index}>
          <GroupListCardSkeleton />
          {index !== PENDING_GROUPS_COUNT - 1 && <ListSeparator />}
        </Fragment>
      ))}
    </View>
  )

/* -------------------------------------------------------------------------------------------------
 * GroupsListEmptyView
 * -----------------------------------------------------------------------------------------------*/
interface GroupsListEmptyViewProps {
  isFetched: boolean
}

const GroupsListEmptyView: FC<GroupsListEmptyViewProps> = ({ isFetched }) =>
  isFetched ? <Typography>No groups found</Typography> : null

/* -------------------------------------------------------------------------------------------------
 * GroupsList
 * -----------------------------------------------------------------------------------------------*/
type GroupsListProps = {
  fetchParams: GroupsListFetchParams
}

const GroupsList: FC<GroupsListProps> = ({ fetchParams }) => {
  const router = useRouter()
  const [listState, manageGroupsList] = usePaginatedState(
    fetchParams,
    getPaginatedGroupsListStateAtom,
    getManagePaginatedGroupsListAtom,
  )

  const handleGroupItemPress = useCallback((item: ShortGroup) => router.navigate(`/groups/${item.id}`), [router])

  const handleEndReached = useCallback(() => {
    listState.hasNextPage && !listState.isFetchingNextPage && manageGroupsList('loadMore')
  }, [listState.hasNextPage, listState.isFetchingNextPage, manageGroupsList])

  const handleRefresh = useCallback(() => {
    manageGroupsList('refresh')
  }, [manageGroupsList])

  const keyExtractor = useCallback((item: ShortGroup) => item.id, [])

  const refreshControl = (
    <RefreshControl onRefresh={handleRefresh} refreshing={listState.isRefreshing} tintColor={colors.primary} />
  )

  const renderItem: ListRenderItem<ShortGroup> = useCallback(
    ({ item }) => <GroupListCard group={item} onPress={() => handleGroupItemPress(item)} />,
    [handleGroupItemPress],
  )

  if (listState.error) return <GroupsListErrorView error={listState.error} />

  return (
    <FlashList
      data={listState.data?.items}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<GroupsListEmptyView isFetched={listState.isFetched} />}
      ListFooterComponent={<GroupsLoadingView isFetchingNextPage={listState.isFetchingNextPage} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
      refreshControl={refreshControl}
      refreshing={listState.isRefreshing}
      renderItem={renderItem}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * HomeScreen (Groups)
 * -----------------------------------------------------------------------------------------------*/
export default function HomeScreen() {
  const { t } = useTranslation()
  const [filter, setFilter] = useAtom(groupFilterAtom)
  const filterSheetRef = useRef<BottomSheet>(null)
  const groupsFetchParams: GroupsListFetchParams = useMemo(() => ({ filter }), [filter])

  const handleFilterButtonPress = useCallback(() => {
    filterSheetRef.current?.expand()
  }, [])

  const clearFilters = useCallback(() => setFilter(emptyGroupFilter), [setFilter])

  const handleFilterSubmit = useCallback(
    (value: GroupsFilter) => {
      setFilter(value)
      filterSheetRef.current?.close()
      return value
    },
    [setFilter],
  )

  return (
    <>
      <BackgroundLayout />
      <ListLayout.Root>
        <ListLayout.Header>
          <FiltersSelectButton onPress={handleFilterButtonPress}>{t('filters_button.text')}</FiltersSelectButton>
        </ListLayout.Header>

        <ListLayout.Content>
          <GroupsList fetchParams={groupsFetchParams} />
        </ListLayout.Content>
      </ListLayout.Root>

      <BottomSheetBackDrop
        ref={filterSheetRef}
        rightButtonAction={clearFilters}
        rightButtonText="Clear All"
        rightButtonVariant="link_danger"
        title="Filters"
      >
        <View style={{ flex: 1, gap: 8, padding: 16 }}>
          <FilterGroups onSubmit={handleFilterSubmit} value={filter} />
        </View>
      </BottomSheetBackDrop>
    </>
  )
}
