import { BackgroundLayout } from "@/components/BackgroundLayout"
import { BottomSheetBackDrop } from "@/components/BottomSheet"
import { FilterGroups } from "@/components/FIlterGroups"
import { FiltersSelectButton } from "@/components/FiltersSelectButton"
import { GroupListCard } from "@/components/GroupListCard"
import * as ListLayout from "@/components/ListLayout"
import type { Group } from "@/models/group"
import { emptyGroupFilter, filterGroups, type GroupFilter } from "@/services/group.service"
import { groupFilterAtom, groupsStore } from "@/store/group"
import { getGroupScreenLink } from "@/utils/links"
import BottomSheet from "@gorhom/bottom-sheet"
import { useRouter } from "expo-router"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useMemo, useRef } from "react"
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
 * HomeScreen (Groups)
 * -----------------------------------------------------------------------------------------------*/
export default function HomeScreen() {
  const allGroups = useAtomValue(groupsStore)
  const [filter, setFilter] = useAtom(groupFilterAtom)
  const filterSheetRef = useRef<BottomSheet>(null)
  const router = useRouter()

  const groups = useMemo(() => filterGroups(allGroups, filter), [allGroups, filter])

  const handleGroupItemPress = useCallback(
    (item: Group) => {
      router.push(getGroupScreenLink(item))
    },
    [router],
  )

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
