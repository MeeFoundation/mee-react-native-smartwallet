import { Avatar } from "@components/Avatar"
import { SelectTags } from "@components/SelectTags"
import { Separator } from "@components/Separator"
import { Link } from "@react-navigation/native"
import { Connection, coreService } from "@services/core.service"
import { colors } from "@utils/theme"
import { useEffect, useState } from "react"
import { Image, SectionList, SectionListData, StyleSheet, Text, View } from "react-native"

const CategoryItem = ({ item }: { item: Connection }) => {
  return (
    <View style={styles.item}>
      <View style={styles.contentBlock}>
        {item.iconSrc && <Image source={item.iconSrc} style={styles.itemIcon} />}
        <Text style={styles.title}>{item.name}</Text>
      </View>
      <View style={StyleSheet.compose(styles.contentBlock, styles.contentBlockRight)}>
        <Link screen="Manage Connection" params={{ id: item.id }}>
          Open
        </Link>
      </View>
    </View>
  )
}

const sortByTags = (selectedTags: string[], connections: Connection[]) => {
  if (selectedTags.length === 0) {
    return [{ title: "All", data: connections }]
  }

  const result: SectionListData<Connection>[] = []
  const map: Record<string, { title: string; data: Connection[] }> = {}

  for (const tag of selectedTags) map[tag] = { title: tag, data: [] }

  for (const connection of connections) {
    for (const tag of connection.tags) {
      if (tag in map) {
        map[tag].data.push(connection)
      }
    }
  }

  for (const tag of selectedTags) {
    result.push(map[tag])
  }

  return result
}

export function Categories() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const filteredData = sortByTags(selectedTags, connections)

  useEffect(() => {
    const get = async () => {
      const [tags, connections] = await Promise.all([
        coreService.getTags(),
        coreService.getConnections(),
      ])
      setConnections(connections)
      setTags(tags)
      setSelectedTags(tags)
    }

    get()
  }, [])

  return (
    <View style={styles.container}>
      <SelectTags
        tags={tags}
        selectedTags={selectedTags}
        onSelectTags={setSelectedTags}
        label="Filter"
      />
      <Separator style={styles.separator} />
      <SectionList
        sections={filteredData}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <CategoryItem item={item} />}
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
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
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
})
