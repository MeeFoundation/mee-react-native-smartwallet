import { ChevronDownSvg, SlidersSvg } from "@assets/bootstrap-icons"
import { Avatar } from "@components/Avatar"
import { BackgroundLayout } from "@components/BackgroundLayout"
import { BottomSheetBackDrop } from "@components/BottomSheet"
import { ConnectionCard } from "@components/ConnectionCard"
import { Footer } from "@components/Footer"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { Connection } from "@services/core.service"
import { ConnectionsStore, TagsStore } from "@store/index"
import { colors } from "@utils/theme"
import { useAtomValue } from "jotai"
import { useRef, useState } from "react"
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const sortByTags = (selectedTags: string[], connections: Connection[]) => {
  if (selectedTags.length === 0) {
    return [{ title: "All", data: connections }]
  }

  const map = new Map<string, { title: string; data: Connection[] }>()

  for (const tag of selectedTags) {
    map.set(tag, { title: tag, data: [] })
  }

  connections.forEach((connection) => {
    connection.tags.forEach((tag) => {
      if (map.has(tag)) {
        map.get(tag)!.data.push(connection)
      }
    })
  })

  return Array.from(map.values())
}

export function Connections() {
  const connections = useAtomValue(ConnectionsStore)
  const allTags = useAtomValue(TagsStore)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const filteredData = sortByTags(selectedTags, connections)
  const navigation = useNavigation()

  const handlePressOpen = (id: string) => {
    navigation.navigate("Manage Connection", { id })
  }

  const onPersonasPress = () => {
    bottomSheetRef.current?.expand()
  }

  return (
    <>
      <BackgroundLayout />
      <View style={styles.container}>
        {/* <FilterTags tags={allTags} selectedTags={selectedTags} onSelectTags={setSelectedTags} /> */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          <TouchableOpacity style={styles.filterButtons} onPress={onPersonasPress}>
            <Text style={styles.filterButtonsText}>All personas</Text>
            <View>
              <ChevronDownSvg height={20} width={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButtons}>
            <Text style={styles.filterButtonsText}>Filters</Text>
            <View style={{ transform: "rotate(90deg)" }}>
              <SlidersSvg height={20} width={20} />
            </View>
          </TouchableOpacity>
        </View>
        {/* <Separator style={styles.separator} /> */}
        <SectionList
          contentContainerStyle={{ gap: 8 }}
          sections={filteredData}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePressOpen(item.id)}>
              <ConnectionCard
                name={item.name}
                onPress={() => handlePressOpen(item.id)}
                logo={item.iconSrc}
              />
            </TouchableOpacity>
          )}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Avatar
                text={title}
                size={22}
                style={{
                  boxShadow: "0px 1px 2px 0px #0000000F, 0px 1px 3px 0px #0000001A",
                }}
              />
              <Text style={styles.header}>#{title}</Text>
            </View>
          )}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          style={styles.sectionContainer}
        />

        <BottomSheetBackDrop ref={bottomSheetRef} title="Select persona">
          <View style={styles.addConnectionContainer}></View>
        </BottomSheetBackDrop>
      </View>
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
    flexDirection: "column",
  },
})
