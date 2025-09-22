import type BottomSheet from '@gorhom/bottom-sheet'
import { useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { ConnectionList, FilterConnections, type FilterValue } from '@/entities/connection'
import { ProfileStore } from '@/entities/profile'

import { BottomSheetBackDrop } from '@/shared/ui/BottomSheet'
import { RadioList } from '@/shared/ui/RadioList'

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
})

export default function CompaniesScreen() {
  const allProfiles = useAtomValue(ProfileStore)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const filterSheetRef = useRef<BottomSheet>(null)
  const [filter, setFilter] = useState<FilterValue>({})
  const [selectedProfile, setSelectedProfile] = useState<string>('All profiles')
  const [temporarySelectedProfile, setTemporarySelectedProfile] = useState<string>('All profiles')

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
        isPeopleView={false}
        onFilterPress={onFilterPress}
        onProfilesPress={onProfilesPress}
        selectedProfile={selectedProfile}
      />

      <BottomSheetBackDrop ref={bottomSheetRef} rightButtonAction={applyProfileFilter} title="Select profile">
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
