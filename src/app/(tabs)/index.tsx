import {
  emptyGroupFilter,
  FilterGroups,
  getManagePaginatedGroupsListAtom,
  getPaginatedGroupsListStateAtom,
  groupFilterAtom,
  GroupListCard,
  GroupListCardSkeleton,
  type GroupsFilter,
  type GroupsListFetchParams,
  type ShortGroup,
} from "@/entities/group"
import { colors } from "@/shared/config"
import type { AppError } from "@/shared/errors"
import { usePaginatedState } from "@/shared/lib/paginated-list"
import { BackgroundLayout } from "@/shared/ui/BackgroundLayout"
import { BottomSheetBackDrop } from "@/shared/ui/BottomSheet"
import { FiltersSelectButton } from "@/shared/ui/FiltersSelectButton"
import * as ListLayout from "@/shared/ui/ListLayout"
import { Typography } from "@/shared/ui/Typography"
import BottomSheet from "@gorhom/bottom-sheet"
import { FlashList, type ListRenderItem } from "@shopify/flash-list"
import { useRouter } from "expo-router"
import { useAtom } from "jotai"
import { range } from "lodash-es"
import { Fragment, useCallback, useMemo, useRef, type FC } from "react"
import { useTranslation } from "react-i18next"
import { RefreshControl, StyleSheet, Text, View, type ViewProps } from "react-native"

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  filterButtonText: {
    fontWeight: 500,
  },
  listSeparator: {
    height: 8,
  },
  loadingView: {
    paddingTop: 8,
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
type GroupsLoadingViewProps = Omit<ViewProps, "children"> & {
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

  const handleGroupItemPress = useCallback(
    (item: ShortGroup) => router.navigate(`/groups/${item.id}`),
    [router],
  )

  const handleEndReached = useCallback(() => {
    listState.hasNextPage && !listState.isFetchingNextPage && manageGroupsList("loadMore")
  }, [listState.hasNextPage, listState.isFetchingNextPage, manageGroupsList])

  const handleRefresh = useCallback(() => {
    manageGroupsList("refresh")
  }, [manageGroupsList])

  const keyExtractor = useCallback((item: ShortGroup) => item.id, [])

  const refreshControl = (
    <RefreshControl
      tintColor={colors.primary}
      refreshing={listState.isRefreshing}
      onRefresh={handleRefresh}
    />
  )

  const renderItem: ListRenderItem<ShortGroup> = useCallback(
    ({ item }) => <GroupListCard group={item} onPress={() => handleGroupItemPress(item)} />,
    [handleGroupItemPress],
  )

  if (listState.error) return <GroupsListErrorView error={listState.error} />

  return (
    <FlashList
      data={listState.data?.items}
      keyExtractor={keyExtractor}
      refreshControl={refreshControl}
      refreshing={listState.isRefreshing}
      ListEmptyComponent={<GroupsListEmptyView isFetched={listState.isFetched} />}
      renderItem={renderItem}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
      ItemSeparatorComponent={ListSeparator}
      ListFooterComponent={<GroupsLoadingView isFetchingNextPage={listState.isFetchingNextPage} />}
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
          <FiltersSelectButton onPress={handleFilterButtonPress}>
            {t("filters_button.text")}
          </FiltersSelectButton>
        </ListLayout.Header>

        <ListLayout.Content>
          <GroupsList fetchParams={groupsFetchParams} />
        </ListLayout.Content>
      </ListLayout.Root>

      <BottomSheetBackDrop
        ref={filterSheetRef}
        title="Filters"
        rightButtonAction={clearFilters}
        rightButtonVariant="link_danger"
        rightButtonText="Clear All"
      >
        <View style={{ flex: 1, padding: 16, gap: 8 }}>
          <FilterGroups value={filter} onSubmit={handleFilterSubmit} />
        </View>
      </BottomSheetBackDrop>
    </>
  )
}
