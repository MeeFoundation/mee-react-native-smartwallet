import { ProviderCard } from "@components/ProviderCard"
import { Typography } from "@components/Typography"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useRoute } from "@react-navigation/native"
import { colors } from "@utils/theme"
import React, { useState } from "react"
import { DimensionValue, StyleSheet, View } from "react-native"

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

export const ManageConnection = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Manage Connection">>()
  const menus: TabItem[] = [
    { label: "Password", component: <Typography></Typography> },
    { label: "Pdasdasd", component: <Typography></Typography> },
    { label: "dasd ", component: <Typography></Typography> },
    { label: "Dasda", component: <Typography></Typography> },
    { label: "Dasdadas", component: <Typography></Typography> },
    { label: "Dasda dasd", component: <Typography></Typography> },
    { label: "Dasda dasddasda", component: <Typography></Typography> },
  ]
  const [activeTab, setActiveTab] = useState(menus?.[0].label)
  const rows = splitIntoRows(menus, 3)

  return (
    <View style={styles.page}>
      <ProviderCard
        name="New York Times"
        logo={require("../assets/images/provider-logo/times.png")}
      />

      <View style={tabsStyles.container}>
        {rows.map((row, rowIdx) => {
          const width: DimensionValue = `${100 / row.length}%`
          return row.map((item, idx) => {
            const originIdx = (rowIdx ?? 1) * 3 + idx

            return (
              <View style={{ ...tabsStyles.item, width }} key={idx}>
                <Typography style={tabsStyles.text}>
                  {item.label} {originIdx}
                </Typography>
              </View>
            )
          })
        })}
      </View>
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
})

const tabsStyles = StyleSheet.create({
  container: {
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
  text: { fontSize: 13, letterSpacing: -0.08, lineHeight: 20, textAlign: "center" },
})
