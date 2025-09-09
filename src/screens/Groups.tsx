import { BackgroundLayout } from "@components/BackgroundLayout"
import { BottomSheetBackDrop } from "@components/BottomSheet"
import { Footer } from "@components/Footer"
import { GroupListCard } from "@components/GroupListCard"
import * as ListLayout from "@components/ListLayout"
import { Typography } from "@components/Typography"
import BottomSheet from "@gorhom/bottom-sheet"
import { Group } from "@services/core.service"
import { GroupsStore } from "@store/index"
import { colors } from "@utils/theme"
import { useAtomValue } from "jotai"
import { FC, useRef } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AdjustmentsVerticalIcon } from "react-native-heroicons/outline"

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors["white/95"],
    borderColor: colors["black/10"],
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: 44,
    alignItems: "center",
  },
  filterButtonText: {
    fontWeight: 500,
  },
})

/* -------------------------------------------------------------------------------------------------
 * Groups
 * -----------------------------------------------------------------------------------------------*/
const Groups: FC = () => {
  const groups = useAtomValue(GroupsStore)
  const filterSheetRef = useRef<BottomSheet>(null)

  const handleGroupItemPress = (item: Group) => {
    console.log("[handleGroupItemPress]: item", item)
  }

  const handleFilterButtonPress = () => {
    filterSheetRef.current?.expand()
  }

  const clearFilters = () => {
    console.log("[clearFilters]")
  }

  return (
    <>
      <BackgroundLayout />
      <ListLayout.Root>
        <ListLayout.Header>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterButtonPress}>
            <Typography style={styles.filterButtonText}>Filters</Typography>
            <AdjustmentsVerticalIcon size={20} color="black" />
          </TouchableOpacity>
        </ListLayout.Header>
        <ListLayout.Content>
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
        <View>
          <Text>Filters</Text>
        </View>
      </BottomSheetBackDrop>
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { Groups }
