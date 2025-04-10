import { NoHaveConnections } from "@assets/index"
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
import { ContactsStore, deleteContactAtom } from "@store/contacts"
import { ConnectionsStore, ProfileStore, customHeader, isConnectionPeopleView } from "@store/index"
import { colors } from "@utils/theme"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { compact, sortBy } from "lodash-es"
import { useMemo, useRef, useState } from "react"
import { Platform, SectionList, StyleSheet, TouchableOpacity, View } from "react-native"
import { AdjustmentsVerticalIcon, ChevronDownIcon } from "react-native-heroicons/outline"
import { filterNullable } from "../utils/ts-utils"

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
      connection.sharedInfo.email?.toLowerCase().includes(email.toLowerCase()),
    )
  }
  if (filter.phone) {
    filteredConnections = filteredConnections.filter((connection) => !!connection.sharedInfo.phone)
  }

  return filterByProfile(filteredConnections, profile)
}

export function Connections() {
  const [isPeopleView, setIsPeopleView] = useAtom(isConnectionPeopleView)
  const setCustomHeader = useSetAtom(customHeader)
  const connections = useAtomValue(ConnectionsStore)
  const contacts = useAtomValue(ContactsStore)
  const deleteContact = useSetAtom(deleteContactAtom)
  const allProfiles = useAtomValue(ProfileStore)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const filterSheetRef = useRef<BottomSheet>(null)
  const [filter, setFilter] = useState<FilterValue>({})
  const [selectedProfile, setSelectedProfile] = useState<string>("All profiles")
  const [temporarySelectedProfile, setTemporarySelectedProfile] = useState<string>("All profiles")

  const filteredIosContactsData = useMemo(
    () =>
      !contacts?.ios
        ? []
        : sortBy(filterConnections(contacts.ios, filter, selectedProfile), "title"),
    [contacts, filter, selectedProfile],
  )
  const filteredAndroidContactsData = useMemo(
    () =>
      !contacts?.android
        ? []
        : sortBy(filterConnections(contacts.android, filter, selectedProfile), "title"),
    [contacts, filter, selectedProfile],
  )
  const filteredData = useMemo(
    () => sortBy(filterConnections(connections, filter, selectedProfile), "title"),
    [connections, filter, selectedProfile],
  )
  const navigation = useNavigation()

  const handlePressOpen = (item: Connection) => {
    if (isPeopleView) {
      navigation.navigate("Manage Contact", {
        id: item.id,
      })
    } else {
      navigation.navigate("Manage Connection", { id: item.id })
    }
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

  const applyFilters = (filt: FilterValue) => {
    setFilter(filt)
    filterSheetRef.current?.close()
  }

  if (
    (isPeopleView &&
      (!contacts ||
        ((!contacts.ios || contacts.ios.length === 0) &&
          (!contacts.android || contacts.android.length === 0)))) ||
    (!isPeopleView && connections.length === 0)
  ) {
    return (
      <>
        <View style={styles.emptyContainer}>
          <NoHaveConnections style={{ flex: 1 }} height="100%" width="100%" />
        </View>
        <Footer activePage={!isPeopleView ? "companies" : "people"} />
      </>
    )
  }

  const getRenderData = () => {
    if (!isPeopleView) {
      return filteredData
    }

    if (contacts?.ios && contacts?.android) {
      return filteredData.map((_, idx) => ({
        data: filterNullable([
          ...filteredIosContactsData[idx].data,
          ...filteredAndroidContactsData[idx].data,
        ]),
      }))
    } else if (contacts?.ios) {
      return filteredData.map((_, idx) => ({
        data: filterNullable([...filteredIosContactsData[idx].data]),
      }))
    } else if (contacts?.android) {
      return filteredData.map((_, idx) => ({
        data: filterNullable([...filteredAndroidContactsData[idx].data]),
      }))
    }
    return [{ data: [] }] as [{ data: Connection[] }]
  }

  const renderData = getRenderData()

  const sectionSeparator = () => <View style={styles.sectionSeparator} />

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
            <AdjustmentsVerticalIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <SectionList
          contentContainerStyle={{ gap: 8 }}
          sections={renderData}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePressOpen(item)}>
              <ConnectionCard
                name={item.name}
                logo={item.iconSrc}
                menuActions={
                  isPeopleView
                    ? compact([
                        Platform.OS === item.contactInfo?.platform && {
                          name: "Delete contact",
                          key: "delete",
                          onPress: async () => {
                            if (item.contactInfo?.recordID) {
                              deleteContact({ contact: item })
                            }
                          },
                          icon: "trash",
                        },
                        {
                          name: "Manage contact",
                          key: "edit",
                          onPress: () => handlePressOpen(item),
                          icon: "pencil",
                        },
                      ])
                    : [
                        {
                          name: "Delete connection",
                          key: "delete",
                          onPress: () => {},
                          icon: "trash",
                        },
                        {
                          name: "Manage connection",
                          key: "edit",
                          onPress: () => {},
                          icon: "pencil",
                        },
                        { name: "Link connection", key: "link", onPress: () => {}, icon: "pencil" },
                      ]
                }
              />
            </TouchableOpacity>
          )}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={sectionSeparator}
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
      <Footer activePage={!isPeopleView ? "companies" : "people"} />
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
  emptyContainer: {
    backgroundColor: "#FDE68A",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
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
