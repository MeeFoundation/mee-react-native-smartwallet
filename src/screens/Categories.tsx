import { SelectTags } from "@components/SelectTags"
import { Separator } from "@components/Separator"
import { Link } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { useState } from "react"
import {
  Image,
  ImageRequireSource,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  View,
} from "react-native"

type DataItem = {
  iconSrc?: ImageRequireSource
  title: string
  id: string
}

const DATA: SectionListData<DataItem>[] = [
  {
    title: "Entertainment",
    data: [
      { iconSrc: require("../assets/images/disney-icon.png"), title: "Disney", id: "6767" },
      {
        iconSrc: require("../assets/images/disney-plus-icon.png"),
        title: "Disney Plus",
        id: "7979878",
      },
    ],
  },
  {
    title: "Google",
    data: [
      {
        iconSrc: require("../assets/images/google-icon.png"),
        title: "Google connection",
        id: "google-1",
      },
      {
        iconSrc: require("../assets/images/google-icon.png"),
        title: "Google connection",
        id: "google-2",
      },
    ],
  },
  {
    title: "Entertainments",
    data: [
      { iconSrc: require("../assets/images/disney-icon.png"), title: "Disney", id: "6767" },
      {
        iconSrc: require("../assets/images/disney-plus-icon.png"),
        title: "Disney Plus",
        id: "7979878",
      },
    ],
  },
  {
    title: "Social",
    data: [
      {
        iconSrc: require("../assets/images/google-icon.png"),
        title: "Google connection",
        id: "google-1",
      },
      {
        iconSrc: require("../assets/images/google-icon.png"),
        title: "Google connection",
        id: "google-2",
      },
    ],
  },
  {
    title: "Smths",
    data: [
      { iconSrc: require("../assets/images/disney-icon.png"), title: "Disney", id: "6767" },
      {
        iconSrc: require("../assets/images/disney-plus-icon.png"),
        title: "Disney Plus",
        id: "7979878",
      },
    ],
  },
  {
    title: "Group",
    data: [
      {
        iconSrc: require("../assets/images/google-icon.png"),
        title: "Google connection",
        id: "google-1",
      },
      {
        iconSrc: require("../assets/images/google-icon.png"),
        title: "Google connection",
        id: "google-2",
      },
    ],
  },
]

export const CategoryItem = ({ item }: { item: DataItem }) => {
  return (
    <View style={styles.item}>
      <View style={styles.contentBlock}>
        {item.iconSrc && <Image source={item.iconSrc} style={styles.itemIcon} />}
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={StyleSheet.compose(styles.contentBlock, styles.contentBlockRight)}>
        <Link screen="Manage Connection" params={{ id: item.id }}>
          Open
        </Link>
      </View>
    </View>
  )
}

export function Categories() {
  const [search, setSearch] = useState("")

  return (
    <View style={styles.container}>
      <SelectTags />
      <Separator style={styles.separator} />
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <CategoryItem item={item} />}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>#{title}</Text>
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
  sectionSeparator: {
    height: 16,
    width: "100%",
  },
})
