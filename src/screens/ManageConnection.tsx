import { Accordion } from "@components/Accordion"
import { ConnectionCard } from "@components/ConnectionCard"
import { SelectTags } from "@components/SelectTags"
import { Typography } from "@components/Typography"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useRoute } from "@react-navigation/native"
import { ConnectionDetails, TagsStore } from "@store/index"
import { colors } from "@utils/theme"
import { useAtom } from "jotai"
import React, { useState } from "react"
import { DimensionValue, Pressable, StyleSheet, View } from "react-native"
import { EnvelopeIcon, UserIcon } from "react-native-heroicons/outline"

type TabItem = {
  label: string
  component: React.ReactNode
}

const splitIntoRows = (items: TabItem[], maxInRow: number) => {
  const rows: Array<Array<TabItem>> = []

  for (let i = 0; i < items.length; i += maxInRow) {
    const row = items.slice(i, i + maxInRow)
    rows.push(row)
  }

  return rows
}

const Tabs = () => {
  const menus: TabItem[] = [
    {
      label: "Profile",
      component: <Typography></Typography>,
    },
  ]
  const [activeTab, setActiveTab] = useState(menus?.[0].label)
  const activeBody = menus.find((menu) => menu.label === activeTab)?.component
  const rows = splitIntoRows(menus, 3)

  const setActive = (tabLabel: string) => {
    if (tabLabel === activeTab) return
    setActiveTab(tabLabel)
  }

  return (
    <View style={tabsStyles.container}>
      <View style={tabsStyles.head}>
        {rows.map((row, rowIdx) => {
          const width: DimensionValue = `${100 / row.length}%`
          return row.map((item, idx) => {
            // const originIdx = (rowIdx ?? 1) * 3 + idx
            const isActive = item.label === activeTab
            const activeStyles = isActive ? tabsStyles.itemActive : {}

            return (
              <Pressable
                onPress={() => setActive(item.label)}
                style={StyleSheet.compose(
                  StyleSheet.compose(tabsStyles.item, { width }),
                  activeStyles,
                )}
                key={idx}
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

export const ManageConnection = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Manage Connection">>()
  const [connection, setConnection] = useAtom(ConnectionDetails(route.params.id))
  const [allTags] = useAtom(TagsStore)

  const setSelectedTags = async (tags: string[]) => {
    if (!connection) return
    const updatedConnection = { ...connection, tags }

    setConnection(updatedConnection)
  }

  return (
    <View style={styles.page}>
      {connection && (
        <>
          <ConnectionCard border showActionMenu name={connection.name} logo={connection.iconSrc} />
          <Tabs />
          <SelectTags
            tags={allTags}
            selectedTags={connection.tags}
            onSelectTags={setSelectedTags}
          />
          <Accordion
            head={<Typography weight="500">Required info shared</Typography>}
            collapsed={false}
          >
            <View style={styles.infoContainer}>
              <View style={StyleSheet.compose(styles.infoRow, styles.infoBorder)}>
                <EnvelopeIcon color={colors.primary} />
                <Typography style={styles.infoText}>{connection.sharedInfo.email}</Typography>
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
  page: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    flexDirection: "column",
    gap: 24,
  },
  infoContainer: { flexDirection: "column" },
  infoRow: { flexDirection: "row", gap: 10, alignItems: "center", paddingVertical: 8 },
  infoSvg: { color: colors.primary },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoText: { color: colors.primary },
})

const tabsStyles = StyleSheet.create({
  container: { flexDirection: "column", gap: 24 },
  head: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    padding: 2,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  itemActive: { backgroundColor: colors.white },
  text: { fontSize: 13, letterSpacing: -0.08, lineHeight: 20, textAlign: "center" },
})
