import { BottomSheetBackDrop } from "@components/BottomSheet"
import { ConnectionList } from "@components/ConnectionList"
import { FilterConnections, FilterValue } from "@components/FilterConnections"
import { Footer } from "@components/Footer"
import { RadioList } from "@components/RadioList"
import BottomSheet from "@gorhom/bottom-sheet"
import { ProfileStore } from "@store/index"
import { useAtomValue } from "jotai"
import { useRef, useState } from "react"
import { StyleSheet, View } from "react-native"

interface ConnectionsProps {
  isPeopleView?: boolean
}
export function Connections(props: ConnectionsProps) {
  const { isPeopleView = false } = props
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
        isPeopleView={isPeopleView}
        onProfilesPress={onProfilesPress}
        onFilterPress={onFilterPress}
      />

      <Footer activePage={!isPeopleView ? "companies" : "people"} />
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

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
  },
})
