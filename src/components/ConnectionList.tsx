import { NoHaveConnections } from "@assets/index"
import { useNavigation } from "@react-navigation/native"
import { Connection } from "@services/core.service"
import { ContactsStore, deleteContactAtom } from "@store/contacts"
import { ConnectionsStore } from "@store/index"
import { useAtomValue, useSetAtom } from "jotai"
import { compact, sortBy } from "lodash-es"
import { FC, useMemo } from "react"
import { Platform, SectionList, StyleSheet, TouchableOpacity, View } from "react-native"
import { AdjustmentsVerticalIcon, ChevronDownIcon } from "react-native-heroicons/outline"
import { filterNullable } from "../utils/ts-utils"
import { BackgroundLayout } from "./BackgroundLayout"
import { ConnectionCard, MenuAction } from "./ConnectionCard"
import { FilterValue } from "./FilterConnections"
import { Typography } from "./Typography"

const filterByProfile = (connections: Connection[], profile: string) => {
  if (profile === "All profiles") {
    return connections
  }

  const filteredConnections: Connection[] = []

  if (profile === "Unspecified") {
    connections.forEach((connection) => {
      if (!connection.profile) {
        filteredConnections.push(connection)
      }
    })
  } else {
    connections.forEach((connection) => {
      if (connection.profile === profile) {
        filteredConnections.push(connection)
      }
    })
  }
  return filteredConnections
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

interface ConnectionListProps {
  isPeopleView: boolean
  filter: FilterValue
  selectedProfile: string
  onProfilesPress: () => void
  onFilterPress: () => void
}
export const ConnectionList: FC<ConnectionListProps> = ({
  isPeopleView,
  filter,
  selectedProfile,
  onProfilesPress,
  onFilterPress,
}) => {
  return !isPeopleView ? (
    <CompaniesList
      filter={filter}
      selectedProfile={selectedProfile}
      onProfilesPress={onProfilesPress}
      onFilterPress={onFilterPress}
    />
  ) : (
    <PeopleList
      filter={filter}
      selectedProfile={selectedProfile}
      onProfilesPress={onProfilesPress}
      onFilterPress={onFilterPress}
    />
  )
}
interface CompaniesListProps {
  filter: FilterValue
  selectedProfile: string
  onProfilesPress: () => void
  onFilterPress: () => void
}

const CompaniesList: FC<CompaniesListProps> = ({
  filter,
  selectedProfile,
  onProfilesPress,
  onFilterPress,
}) => {
  const navigation = useNavigation()
  const connections = useAtomValue(ConnectionsStore)
  const filteredData = useMemo(
    () => sortBy(filterConnections(connections, filter, selectedProfile), "title"),
    [connections, filter, selectedProfile],
  )

  if (connections.length === 0) {
    return <EmptyConnections />
  }
  const getMenuActions = (_item: Connection) => {
    const menuActions: MenuAction[] = [
      {
        name: "Source Profile",
        key: "source-profile",
        onPress: () => {},
        icon: "userGroup",
      },
      {
        name: "Manage connection",
        key: "edit",
        onPress: () => {},
        icon: "pencil",
      },
      { name: "Link connection", key: "link", onPress: () => {}, icon: "link" },
      {
        name: "Archive Connection",
        key: "delete",
        onPress: () => {},
        icon: "trash",
      },
    ]
    return menuActions
  }
  const handlePressOpen = (item: Connection) => {
    navigation.navigate("Manage Connection", { id: item.id })
  }

  return (
    <CollectionsContentView
      renderData={filteredData}
      handlePressOpen={handlePressOpen}
      getMenuActions={getMenuActions}
      onProfilesPress={onProfilesPress}
      onFilterPress={onFilterPress}
      selectedProfile={selectedProfile}
    />
  )
}

const PeopleList: FC<CompaniesListProps> = ({
  filter,
  selectedProfile,
  onProfilesPress,
  onFilterPress,
}) => {
  const navigation = useNavigation()
  const contacts = useAtomValue(ContactsStore)
  const deleteContact = useSetAtom(deleteContactAtom)
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

  if (
    !contacts ||
    ((!contacts.ios || contacts.ios.length === 0) &&
      (!contacts.android || contacts.android.length === 0))
  ) {
    return <EmptyConnections />
  }
  const getMenuActions = (item: Connection) => {
    const menuActions: MenuAction[] = compact([
      Platform.OS === item.contactInfo?.platform && {
        name: "Delete contact",
        key: "delete",
        onPress: () => {
          if (item.contactInfo?.recordID) {
            // TODO add error handling
            deleteContact({ contact: item }).catch((err) => {
              console.error("error deleting contact", err)
            })
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
    return menuActions
  }
  const renderData = filterNullable([...filteredIosContactsData, ...filteredAndroidContactsData])
  const handlePressOpen = (item: Connection) => {
    navigation.navigate("Manage Contact", {
      id: item.id,
    })
  }

  return (
    <CollectionsContentView
      renderData={renderData}
      handlePressOpen={handlePressOpen}
      getMenuActions={getMenuActions}
      onProfilesPress={onProfilesPress}
      onFilterPress={onFilterPress}
      selectedProfile={selectedProfile}
    />
  )
}

interface CollectionsContentViewProps {
  renderData: Connection[]
  handlePressOpen: (item: Connection) => void
  getMenuActions: (item: Connection) => MenuAction[]
  onProfilesPress: () => void
  onFilterPress: () => void
  selectedProfile: string
}

const CollectionsContentView: FC<CollectionsContentViewProps> = ({
  renderData,
  handlePressOpen,
  getMenuActions,
  onProfilesPress,
  onFilterPress,
  selectedProfile,
}) => {
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
          sections={[{ data: renderData }]}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePressOpen(item)}>
              <ConnectionCard
                name={item.name}
                logo={item.iconSrc}
                menuActions={getMenuActions(item)}
              />
            </TouchableOpacity>
          )}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={sectionSeparator}
          style={styles.sectionContainer}
        />
      </View>
    </>
  )
}

const EmptyConnections = () => {
  return (
    <View style={styles.emptyContainer}>
      <NoHaveConnections style={{ flex: 1 }} height="100%" width="100%" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 16,
  },
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
  sectionContainer: {
    flex: 1,
    marginTop: 8,
  },
  sectionSeparator: {
    height: 12,
    width: "100%",
  },
  emptyContainer: {
    backgroundColor: "#FDE68A",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
})
