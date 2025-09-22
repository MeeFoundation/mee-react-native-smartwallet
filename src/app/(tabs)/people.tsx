import { FilterConnections, type FilterValue } from "@/entities/connection"
import type { PersonsListFetchParams, ShortPerson } from "@/entities/person"
import {
  getManagePaginatedPersonsListAtom,
  getPaginatedPersonsListStateAtom,
  PersonListCard,
  PersonListSkeleton,
} from "@/entities/person"
import { ProfileStore } from "@/entities/profile"
import { colors } from "@/shared/config"
import type { AppError } from "@/shared/errors"
import { BackgroundLayout } from "@/shared/ui/BackgroundLayout"
import { BottomSheetBackDrop } from "@/shared/ui/BottomSheet"
import { FiltersSelectButton } from "@/shared/ui/FiltersSelectButton"
import * as ListLayout from "@/shared/ui/ListLayout"
import { RadioList } from "@/shared/ui/RadioList"
import { Typography } from "@/shared/ui/Typography"
import BottomSheet from "@gorhom/bottom-sheet"
import { FlashList, type ListRenderItem } from "@shopify/flash-list"
import { useAtomValue } from "jotai"
import { range } from "lodash-es"
import { Fragment, useCallback, useMemo, useRef, useState, type FC } from "react"
import { useTranslation } from "react-i18next"
import { RefreshControl, StyleSheet, Text, View, type ViewProps } from "react-native"

import { usePaginatedState } from "@/shared/lib/paginated-list"

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
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
 * PeopleListErrorView
 * -----------------------------------------------------------------------------------------------*/
type PeopleListErrorProps = {
  error: AppError
}

// TODO implement error view´
const PeopleListErrorView: FC<PeopleListErrorProps> = () => <Text>Error</Text>

/* -------------------------------------------------------------------------------------------------
 * PersonsLoadingView
 * -----------------------------------------------------------------------------------------------*/
type PersonsLoadingViewProps = Omit<ViewProps, "children"> & {
  isFetchingNextPage: boolean
}

const PENDING_PERSONS_COUNT = 6

const PersonsLoadingView: FC<PersonsLoadingViewProps> = ({ isFetchingNextPage, style, ...rest }) =>
  !isFetchingNextPage ? null : (
    <View style={[styles.loadingView, style]} {...rest}>
      {range(PENDING_PERSONS_COUNT).map((index) => (
        <Fragment key={index}>
          <PersonListSkeleton />
          {index !== PENDING_PERSONS_COUNT - 1 && <ListSeparator />}
        </Fragment>
      ))}
    </View>
  )

/* -------------------------------------------------------------------------------------------------
 * PersonsListEmptyView
 * -----------------------------------------------------------------------------------------------*/
interface PersonsListEmptyViewProps {
  isFetched: boolean
}

const PersonsListEmptyView: FC<PersonsListEmptyViewProps> = ({ isFetched }) =>
  isFetched ? <Typography>No people found</Typography> : null

/* -------------------------------------------------------------------------------------------------
 * PersonsList
 * -----------------------------------------------------------------------------------------------*/
const PersonsList: FC = () => {
  const fetchParams: PersonsListFetchParams = useMemo(
    () => ({ filter: { connectionStatus: "active" } }),
    [],
  )

  const [listState, managePersonsList] = usePaginatedState(
    fetchParams,
    getPaginatedPersonsListStateAtom,
    getManagePaginatedPersonsListAtom,
  )

  const handlePersonItemPress = useCallback((_item: ShortPerson) => {
    throw new Error("Not implemented")
  }, [])

  const handleEndReached = useCallback(() => {
    listState.hasNextPage && !listState.isFetchingNextPage && managePersonsList("loadMore")
  }, [listState.hasNextPage, listState.isFetchingNextPage, managePersonsList])

  const handleRefresh = useCallback(() => {
    managePersonsList("refresh")
  }, [managePersonsList])

  const keyExtractor = useCallback((item: ShortPerson) => item.id, [])

  const refreshControl = (
    <RefreshControl
      tintColor={colors.primary}
      refreshing={listState.isRefreshing}
      onRefresh={handleRefresh}
    />
  )

  const renderItem: ListRenderItem<ShortPerson> = useCallback(
    ({ item }) => <PersonListCard person={item} onPress={() => handlePersonItemPress(item)} />,
    [handlePersonItemPress],
  )

  if (listState.error) return <PeopleListErrorView error={listState.error} />

  return (
    <FlashList
      data={listState.data?.items}
      keyExtractor={keyExtractor}
      refreshControl={refreshControl}
      refreshing={listState.isRefreshing}
      ListEmptyComponent={<PersonsListEmptyView isFetched={listState.isFetched} />}
      renderItem={renderItem}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
      ItemSeparatorComponent={ListSeparator}
      ListFooterComponent={<PersonsLoadingView isFetchingNextPage={listState.isFetchingNextPage} />}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * PeopleScreen
 * -----------------------------------------------------------------------------------------------*/
export default function PeopleScreen() {
  const { t } = useTranslation()
  const allProfiles = useAtomValue(ProfileStore)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const filterSheetRef = useRef<BottomSheet>(null)
  const [filter, setFilter] = useState<FilterValue>({})
  const [temporarySelectedProfile, setTemporarySelectedProfile] = useState<string>("All profiles")

  const clearFilters = () => {
    setFilter({})
  }

  const applyFilters = (filt: FilterValue) => {
    setFilter(filt)
    filterSheetRef.current?.close()
  }

  return (
    <>
      <BackgroundLayout />
      <ListLayout.Root>
        <ListLayout.Header>
          <FiltersSelectButton>{t("filters_button.text")}</FiltersSelectButton>
        </ListLayout.Header>
        <ListLayout.Content>
          <PersonsList />
        </ListLayout.Content>
      </ListLayout.Root>

      <BottomSheetBackDrop
        ref={bottomSheetRef}
        title="Select profile"
        // rightButtonAction={applyProfileFilter}
      >
        <View style={styles.addConnectionContainer}>
          <RadioList
            data={allProfiles}
            onSelect={setTemporarySelectedProfile}
            selected={temporarySelectedProfile}
          />
        </View>
      </BottomSheetBackDrop>

      <BottomSheetBackDrop
        ref={filterSheetRef}
        title="Filters"
        rightButtonAction={clearFilters}
        rightButtonVariant="link_danger"
        rightButtonText="Clear All"
      >
        <View style={styles.addConnectionContainer}>
          <FilterConnections filter={filter} onChangeFilter={applyFilters} />
        </View>
      </BottomSheetBackDrop>
    </>
  )
}
