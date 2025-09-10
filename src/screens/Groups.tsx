import { BackgroundLayout } from "@components/BackgroundLayout"
import { BottomSheetBackDrop } from "@components/BottomSheet"
import { FilterGroups } from "@components/FIlterGroups"
import { FiltersSelectButton } from "@components/FiltersSelectButton"
import { Footer } from "@components/Footer"
import { GroupListCard } from "@components/GroupListCard"
import * as ListLayout from "@components/ListLayout"
import BottomSheet from "@gorhom/bottom-sheet"
import { emptyGroupFilter, filterGroups, Group, GroupFilter } from "@services/group.service"
import { groupFilterAtom } from "@store/group"
import { GroupsStore } from "@store/index"
import { useAtom, useAtomValue } from "jotai"
import { FC, useCallback, useMemo, useRef } from "react"
import { FlatList, StyleSheet, View } from "react-native"

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  filterButtonText: {
    fontWeight: 500,
  },
})

/* -------------------------------------------------------------------------------------------------
 * Groups
 * -----------------------------------------------------------------------------------------------*/
const Groups: FC = () => {
  const allGroups = useAtomValue(GroupsStore)
  const [filter, setFilter] = useAtom(groupFilterAtom)
  const filterSheetRef = useRef<BottomSheet>(null)

  const groups = useMemo(() => filterGroups(allGroups, filter), [allGroups, filter])

  const handleGroupItemPress = useCallback((item: Group) => {
    console.log("[handleGroupItemPress]: item", item)
  }, [])

  const handleFilterButtonPress = useCallback(() => {
    filterSheetRef.current?.expand()
  }, [])

  const clearFilters = useCallback(() => setFilter(emptyGroupFilter), [setFilter])

  const handleFilterSubmit = useCallback(
    (value: GroupFilter) => {
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
          <FiltersSelectButton onPress={handleFilterButtonPress} />
        </ListLayout.Header>
        <ListLayout.Content>
          {/* TODO: add error view */}
          {/* TODO: add empty view */}
          {/* TODO: add loading view */}
          <FlatList
            data={groups}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => (
              <GroupListCard group={item} onPress={() => handleGroupItemPress(item)} />
            )}
            style={styles.sectionContainer}
          />
        </ListLayout.Content>
      </ListLayout.Root>
      <Footer activePage="groups" />

      <BottomSheetBackDrop
        ref={filterSheetRef}
        title="Filters"
        rightButtonAction={clearFilters}
        rightButtonVariant="link_danger"
        rightButtonText="Clear All"
      >
        <View style={{ flex: 1, padding: 16, gap: 8 }}>
          <FilterGroups value={filter} onSubmit={handleFilterSubmit} groups={allGroups} />
        </View>
      </BottomSheetBackDrop>
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Groups }
