import { ConnectionList, FilterConnections, type FilterValue } from "@/entities/connection"
import { ProfileStore } from "@/entities/profile"
import { BottomSheetBackDrop } from "@/shared/ui/BottomSheet"
import { RadioList } from "@/shared/ui/RadioList"
import BottomSheet from "@gorhom/bottom-sheet"
import { useAtomValue } from "jotai"
import { useRef, useState } from "react"
import { StyleSheet, View } from "react-native"

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
  },
})

export default function CompaniesScreen() {
  const allProfiles = useAtomValue(ProfileStore)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const filterSheetRef = useRef<BottomSheet>(null)
  const [filter, setFilter] = useState<FilterValue>({})
  const [selectedProfile, setSelectedProfile] = useState<string>("All profiles")
  const [temporarySelectedProfile, setTemporarySelectedProfile] = useState<string>("All profiles")

  const applyProfileFilter = () => {
    setSelectedProfile(temporarySelectedProfile)
  }
  const onProfilesPress = () => {
    setTemporarySelectedProfile(selectedProfile)
    bottomSheetRef.current?.expand()
  }
  const onFilterPress = () => {
    setTemporarySelectedProfile(selectedProfile)
    filterSheetRef.current?.expand()
  }

  const clearFilters = () => {
    setFilter({})
  }

  const applyFilters = (filt: FilterValue) => {
    setFilter(filt)
    filterSheetRef.current?.close()
  }

  return (
    <>
      <ConnectionList
        filter={filter}
        selectedProfile={selectedProfile}
        isPeopleView={false}
        onProfilesPress={onProfilesPress}
        onFilterPress={onFilterPress}
      />

      <BottomSheetBackDrop
        ref={bottomSheetRef}
        title="Select profile"
        rightButtonAction={applyProfileFilter}
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
