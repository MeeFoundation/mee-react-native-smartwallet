import { BackgroundLayout } from "@components/BackgroundLayout"
import { BottomSheetBackDrop } from "@components/BottomSheet"
import { ConnectionCard } from "@components/ConnectionCard"
import { FilterConnections, FilterValue } from "@components/FilterConnections"
import { Footer } from "@components/Footer"
import { RadioList } from "@components/RadioList"
import { Typography } from "@components/Typography"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { Connection } from "@services/core.service"
import { ConnectionsStore, ProfileStore } from "@store/index"
import { colors } from "@utils/theme"
import { useAtomValue } from "jotai"
import { useRef, useState } from "react"
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native"
import { AdjustmentsVerticalIcon, ChevronDownIcon } from "react-native-heroicons/outline"

const filterByProfile = (connections: Connection[], profile: string) => {
  if (profile === "All profiles") {
    return [{ title: "All profiles", data: connections }]
  }

  const map = new Map<string, { title: string; data: Connection[] }>()
  map.set(profile, { title: profile, data: [] })

  if (profile === "Unspecified") {
    connections.forEach((connection) => {
      if (!connection.profile) {
        map.get("Unspecified")!.data.push(connection)
      }
    })
  } else {
    connections.forEach((connection) => {
      if (connection.profile === profile) {
        map.get(profile)!.data.push(connection)
      }
    })
  }
  return Array.from(map.values())
}

const filterConnections = (connections: Connection[], filter: FilterValue, profile: string) => {
  let filteredConnections = connections
  if (filter.email) {
    const email = filter.email
    filteredConnections = filteredConnections.filter((connection) =>
      connection.sharedInfo.email.toLowerCase().includes(email.toLowerCase()),
    )
  }
  if (filter.phone) {
    filteredConnections = filteredConnections.filter((connection) => !!connection.sharedInfo.phone)
  }

  return filterByProfile(filteredConnections, profile)
}

export function Connections() {
  const connections = useAtomValue(ConnectionsStore)
  const allProfiles = useAtomValue(ProfileStore)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const filterSheetRef = useRef<BottomSheet>(null)
  const [filter, setFilter] = useState<FilterValue>({})
  const [selectedProfile, setSelectedProfile] = useState<string>("All profiles")
  const [temporarySelectedProfile, setTemporarySelectedProfile] = useState<string>("All profiles")
  const filteredData = filterConnections(connections, filter, selectedProfile)
  const navigation = useNavigation()

  const handlePressOpen = (id: string) => {
    navigation.navigate("Manage Connection", { id })
  }

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

  const applyFilters = (filter: FilterValue) => {
    setFilter(filter)
    filterSheetRef.current?.close()
  }

  return (
    <>
      <BackgroundLayout />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          <TouchableOpacity style={styles.filterButtons} onPress={onProfilesPress}>
            <Typography style={styles.filterButtonsText}>{selectedProfile}</Typography>
            <ChevronDownIcon size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButtons} onPress={onFilterPress}>
            <Typography style={styles.filterButtonsText}>Filters</Typography>
            <AdjustmentsVerticalIcon size={20} color="black"/>
          </TouchableOpacity>
        </View>

        <SectionList
          contentContainerStyle={{ gap: 8 }}
          sections={filteredData}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePressOpen(item.id)}>
              <ConnectionCard
                name={item.name}
                onPress={() => handlePressOpen(item.id)}
                showActionMenu
                logo={item.iconSrc}
              />
            </TouchableOpacity>
          )}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          style={styles.sectionContainer}
        />
      </View>
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
      <Footer isConnectionsPage />
    </>
  )
}

const styles = StyleSheet.create({
  filterButtons: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 44,
    alignItems: "center",
  },
  filterButtonsText: {
    fontWeight: 500,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 16,
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors["gray-100"],
    padding: 8,
    marginVertical: 4,
  },
  contentBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  contentBlockRight: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  itemIcon: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  header: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.secondary,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.secondary,
  },
  sectionContainer: {
    flex: 1,
    marginTop: 8,
  },
  sectionHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 4,
    backgroundColor: colors.white,
    gap: 8,
  },
  sectionSeparator: {
    height: 12,
    width: "100%",
  },
  addConnection: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  addConnectionContainer: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
  },
})
