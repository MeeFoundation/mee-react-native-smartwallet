import type BottomSheet from '@gorhom/bottom-sheet'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { range } from 'lodash-es'
import { type FC, Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, StyleSheet, Text, View, type ViewProps } from 'react-native'

import { Header, ScreenLayout, ToggleDrawerButton } from '@/widgets/navigation'

import { FilterConnections, type FilterValue } from '@/entities/connection'
import type { PersonsListFetchParams, ShortPerson } from '@/entities/person'
import {
  getManagePaginatedPersonsListAtom,
  getPaginatedPersonsListStateAtom,
  PersonListCard,
  PersonListSkeleton,
} from '@/entities/person'
import { ProfileStore } from '@/entities/profile'

import { colors } from '@/shared/config'
import type { AppError } from '@/shared/errors'
import { usePaginatedState } from '@/shared/lib/paginated-list'
import { BottomSheetBackDrop } from '@/shared/ui/BottomSheet'
import { FiltersSelectButton } from '@/shared/ui/FiltersSelectButton'
import * as ListLayout from '@/shared/ui/ListLayout'
import { RadioList } from '@/shared/ui/RadioList'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
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
type PersonsLoadingViewProps = Omit<ViewProps, 'children'> & {
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
  const fetchParams: PersonsListFetchParams = useMemo(() => ({ filter: { connectionStatus: 'active' } }), [])

  const [listState, managePersonsList] = usePaginatedState(
    fetchParams,
    getPaginatedPersonsListStateAtom,
    getManagePaginatedPersonsListAtom,
  )

  const handlePersonItemPress = useCallback((_item: ShortPerson) => {
    throw new Error('Not implemented')
  }, [])

  const handleEndReached = useCallback(() => {
    listState.hasNextPage && !listState.isFetchingNextPage && managePersonsList('loadMore')
  }, [listState.hasNextPage, listState.isFetchingNextPage, managePersonsList])

  const handleRefresh = useCallback(() => {
    managePersonsList('refresh')
  }, [managePersonsList])

  const keyExtractor = useCallback((item: ShortPerson) => item.id, [])

  const refreshControl = (
    <RefreshControl onRefresh={handleRefresh} refreshing={listState.isRefreshing} tintColor={colors.primary} />
  )

  const renderItem: ListRenderItem<ShortPerson> = useCallback(
    ({ item }) => <PersonListCard onPress={() => handlePersonItemPress(item)} person={item} />,
    [handlePersonItemPress],
  )

  if (listState.error) return <PeopleListErrorView error={listState.error} />

  return (
    <FlashList
      data={listState.data?.items}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<PersonsListEmptyView isFetched={listState.isFetched} />}
      ListFooterComponent={<PersonsLoadingView isFetchingNextPage={listState.isFetchingNextPage} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
      refreshControl={refreshControl}
      refreshing={listState.isRefreshing}
      renderItem={renderItem}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * PeopleScreenHeader
 * -----------------------------------------------------------------------------------------------*/
const PeopleScreenHeader: FC = () => {
  const { t } = useTranslation()

  return (
    <Header.Root variant="primary">
      <Header.Actions position="left">
        <Header.TitleText>{t('tabs.people.title')}</Header.TitleText>
      </Header.Actions>
      <Header.Actions position="right">
        <Header.IconButton icon="magnifying-glass.outlined" />
        <Header.IconButton icon="bell.outlined" />
        <ToggleDrawerButton />
      </Header.Actions>
    </Header.Root>
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
  const [temporarySelectedProfile, setTemporarySelectedProfile] = useState<string>('All profiles')

  const clearFilters = () => {
    setFilter({})
  }

  const applyFilters = (filt: FilterValue) => {
    setFilter(filt)
    filterSheetRef.current?.close()
  }

  return (
    <>
      <ScreenLayout.Root>
        <PeopleScreenHeader />

        <ScreenLayout.Content scrollable={false}>
          <ListLayout.Root>
            <ListLayout.Header>
              <FiltersSelectButton>{t('filters_button.text')}</FiltersSelectButton>
            </ListLayout.Header>
            <ListLayout.Content>
              <PersonsList />
            </ListLayout.Content>
          </ListLayout.Root>
        </ScreenLayout.Content>
      </ScreenLayout.Root>

      <BottomSheetBackDrop
        ref={bottomSheetRef}
        title="Select profile"
        // rightButtonAction={applyProfileFilter}
      >
        <View style={styles.addConnectionContainer}>
          <RadioList data={allProfiles} onSelect={setTemporarySelectedProfile} selected={temporarySelectedProfile} />
        </View>
      </BottomSheetBackDrop>

      <BottomSheetBackDrop
        ref={filterSheetRef}
        rightButtonAction={clearFilters}
        rightButtonText="Clear All"
        rightButtonVariant="link_danger"
        title="Filters"
      >
        <View style={styles.addConnectionContainer}>
          <FilterConnections filter={filter} onChangeFilter={applyFilters} />
        </View>
      </BottomSheetBackDrop>
    </>
  )
}
