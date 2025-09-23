import { useLocalSearchParams } from 'expo-router'
import { useAtom } from 'jotai'
import type React from 'react'
import { useMemo, useState } from 'react'
import { type DimensionValue, Pressable, StyleSheet, View } from 'react-native'
import { EnvelopeIcon, UserIcon } from 'react-native-heroicons/outline'

import { ConnectionCard, ConnectionDetails, type MenuAction } from '@/entities/connection'
import { TagsStore } from '@/entities/tag'

import { colors } from '@/shared/config'
import { InvalidRouteParamsError } from '@/shared/errors'
import { Accordion } from '@/shared/ui/Accordion'
import { SelectTags } from '@/shared/ui/SelectTags'
import { Typography } from '@/shared/ui/Typography'

type TabItem = {
  label: string
  component: React.ReactNode
}

const splitIntoRows = (items: TabItem[], maxInRow: number) => {
  const rows: TabItem[][] = []

  for (let i = 0; i < items.length; i += maxInRow) {
    const row = items.slice(i, i + maxInRow)
    rows.push(row)
  }

  return rows
}

const Tabs = () => {
  const menus: TabItem[] = [
    {
      component: <Typography />,
      label: 'Profile',
    },
  ]
  const [activeTab, setActiveTab] = useState(menus?.[0].label)
  const rows = splitIntoRows(menus, 3)

  const setActive = (tabLabel: string) => {
    if (tabLabel === activeTab) {
      return
    }
    setActiveTab(tabLabel)
  }

  return (
    <View style={tabsStyles.container}>
      <View style={tabsStyles.head}>
        {rows.map((row) => {
          const width: DimensionValue = `${100 / row.length}%`
          return row.map((item) => {
            // const originIdx = (rowIdx ?? 1) * 3 + idx
            const isActive = item.label === activeTab
            const activeStyles = isActive ? tabsStyles.itemActive : {}

            return (
              <Pressable
                key={item.label}
                onPress={() => setActive(item.label)}
                style={[StyleSheet.compose(tabsStyles.item, { width }), activeStyles]}
              >
                <Typography style={tabsStyles.text}>{item.label}</Typography>
              </Pressable>
            )
          })
        })}
      </View>
      {/* {activeBody} */}
    </View>
  )
}

export default function ManageConnection() {
  const { id } = useLocalSearchParams()
  if (typeof id !== 'string') throw new InvalidRouteParamsError()

  const [connection, setConnection] = useAtom(ConnectionDetails(id))
  const [allTags] = useAtom(TagsStore)

  const setSelectedTags = (tags: string[]) => {
    if (!connection) {
      return
    }
    const updatedConnection = { ...connection, tags }

    // TODO add error handling
    setConnection(updatedConnection).catch((err) => {
      console.error('error setting selected tags', err)
    })
  }

  const connectionCardActions = useMemo<MenuAction[]>(
    () => [
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
    ],
    [],
  )

  return (
    <View style={styles.page}>
      {connection && (
        <>
          <ConnectionCard border logo={connection.iconSrc} menuActions={connectionCardActions} name={connection.name} />
          <Tabs />
          <SelectTags onSelectTags={setSelectedTags} selectedTags={connection.tags} tags={allTags} />
          <Accordion collapsed={false} head={<Typography weight="500">Required info shared</Typography>}>
            <View style={styles.infoContainer}>
              <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                <EnvelopeIcon color={colors.primary} />
                <Typography style={styles.infoText}>{connection.sharedInfo.emails?.[0]?.value}</Typography>
              </View>
              <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                <UserIcon color={colors.primary} />
                <Typography style={styles.infoText}>{connection.sharedInfo.firstName}</Typography>
              </View>
              <View style={styles.infoRow}>
                <UserIcon color={colors.primary} />
                <Typography style={styles.infoText}>{connection.sharedInfo.lastName}</Typography>
              </View>
            </View>
          </Accordion>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  infoBorder: { borderBottomColor: colors.border, borderBottomWidth: 1 },
  infoContainer: { flexDirection: 'column' },
  infoRow: { alignItems: 'center', flexDirection: 'row', gap: 10, paddingVertical: 8 },
  infoSvg: { color: colors.primary },
  infoText: { color: colors.primary },
  page: {
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
    gap: 24,
    padding: 16,
  },
})

const tabsStyles = StyleSheet.create({
  container: { flexDirection: 'column', gap: 24 },
  head: {
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  item: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  itemActive: { backgroundColor: colors.white },
  text: { fontSize: 13, letterSpacing: -0.08, lineHeight: 20, textAlign: 'center' },
})
