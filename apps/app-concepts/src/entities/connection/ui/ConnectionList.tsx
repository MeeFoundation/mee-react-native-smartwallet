import { useRouter } from 'expo-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { compact, sortBy } from 'lodash-es'
import { type FC, useMemo } from 'react'
import { Platform, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AdjustmentsVerticalIcon, ChevronDownIcon } from 'react-native-heroicons/outline'

import { NoHaveConnections } from '@/assets/images'

import { ContactsStore, deleteContactAtom } from '@/entities/contact/@x/connection'

import { filterNullable } from '@/shared/lib/ts-utils'
import { BackgroundLayout } from '@/shared/ui/BackgroundLayout'
import { Typography } from '@/shared/ui/Typography'

import { ConnectionsStore } from '../model/store'
import type { Connection } from '../model/types'
import { ConnectionCard, type MenuAction } from './ConnectionCard'
import type { FilterValue } from './FilterConnections'

const filterByProfile = (connections: Connection[], profile: string) => {
  if (profile === 'All profiles') {
    return connections
  }

  const filteredConnections: Connection[] = []

  if (profile === 'Unspecified') {
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
      onFilterPress={onFilterPress}
      onProfilesPress={onProfilesPress}
      selectedProfile={selectedProfile}
    />
  ) : (
    <PeopleList
      filter={filter}
      onFilterPress={onFilterPress}
      onProfilesPress={onProfilesPress}
      selectedProfile={selectedProfile}
    />
  )
}
interface CompaniesListProps {
  filter: FilterValue
  selectedProfile: string
  onProfilesPress: () => void
  onFilterPress: () => void
}

const CompaniesList: FC<CompaniesListProps> = ({ filter, selectedProfile, onProfilesPress, onFilterPress }) => {
  const router = useRouter()
  const connections = useAtomValue(ConnectionsStore)
  const filteredData = useMemo(
    () => sortBy(filterConnections(connections, filter, selectedProfile), 'title'),
    [connections, filter, selectedProfile],
  )

  if (connections.length === 0) {
    return <EmptyConnections />
  }
  const getMenuActions = (_item: Connection) => {
    const menuActions: MenuAction[] = [
      {
        icon: 'userGroup',
        key: 'source-profile',
        name: 'Source Profile',
        onPress: () => {},
      },
      {
        icon: 'pencil',
        key: 'edit',
        name: 'Manage connection',
        onPress: () => {},
      },
      { icon: 'link', key: 'link', name: 'Link connection', onPress: () => {} },
      {
        icon: 'trash',
        key: 'delete',
        name: 'Archive Connection',
        onPress: () => {},
      },
    ]
    return menuActions
  }
  const handlePressOpen = (item: Connection) => {
    router.navigate(`/manage-connection/${item.id}`)
  }

  return (
    <CollectionsContentView
      getMenuActions={getMenuActions}
      handlePressOpen={handlePressOpen}
      onFilterPress={onFilterPress}
      onProfilesPress={onProfilesPress}
      renderData={filteredData}
      selectedProfile={selectedProfile}
    />
  )
}

const PeopleList: FC<CompaniesListProps> = ({ filter, selectedProfile, onProfilesPress, onFilterPress }) => {
  const router = useRouter()
  const contacts = useAtomValue(ContactsStore)
  const deleteContact = useSetAtom(deleteContactAtom)
  const filteredIosContactsData = useMemo(
    () => (!contacts?.ios ? [] : sortBy(filterConnections(contacts.ios, filter, selectedProfile), 'title')),
    [contacts, filter, selectedProfile],
  )
  const filteredAndroidContactsData = useMemo(
    () => (!contacts?.android ? [] : sortBy(filterConnections(contacts.android, filter, selectedProfile), 'title')),
    [contacts, filter, selectedProfile],
  )

  if (
    !contacts ||
    ((!contacts.ios || contacts.ios.length === 0) && (!contacts.android || contacts.android.length === 0))
  ) {
    return <EmptyConnections />
  }
  const getMenuActions = (item: Connection) => {
    const menuActions: MenuAction[] = compact([
      Platform.OS === item.contactInfo?.platform && {
        icon: 'trash',
        key: 'delete',
        name: 'Delete contact',
        onPress: () => {
          if (item.contactInfo?.recordID) {
            // TODO add error handling
            deleteContact({ contact: item }).catch((err) => {
              console.error('error deleting contact', err)
            })
          }
        },
      },
      {
        icon: 'pencil',
        key: 'edit',
        name: 'Manage contact',
        onPress: () => handlePressOpen(item),
      },
    ])
    return menuActions
  }

  const renderData = filterNullable([...filteredIosContactsData, ...filteredAndroidContactsData])

  const handlePressOpen = (item: Connection) => {
    router.navigate(`/manage-connection/${item.id}`)
  }

  return (
    <CollectionsContentView
      getMenuActions={getMenuActions}
      handlePressOpen={handlePressOpen}
      onFilterPress={onFilterPress}
      onProfilesPress={onProfilesPress}
      renderData={renderData}
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
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={onProfilesPress} style={styles.filterButtons}>
            <Typography style={styles.filterButtonsText}>{selectedProfile}</Typography>
            <ChevronDownIcon color="black" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButtons}>
            <Typography style={styles.filterButtonsText}>Filters</Typography>
            <AdjustmentsVerticalIcon color="black" size={20} />
          </TouchableOpacity>
        </View>
        <SectionList
          contentContainerStyle={{ gap: 8 }}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePressOpen(item)}>
              <ConnectionCard logo={item.iconSrc} menuActions={getMenuActions(item)} name={item.name} />
            </TouchableOpacity>
          )}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={sectionSeparator}
          sections={[{ data: renderData }]}
          style={styles.sectionContainer}
        />
      </View>
    </>
  )
}

const EmptyConnections = () => {
  return (
    <View style={styles.emptyContainer}>
      <NoHaveConnections height="100%" style={{ flex: 1 }} width="100%" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: '#FDE68A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  filterButtons: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    width: '100%',
  },
})
