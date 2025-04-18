import { ParamListBase, RouteProp, useRoute } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline"
import { useDrawer } from "./Drawer"
import { Typography } from "./Typography"

export const HeaderRight = () => {
  const { open } = useDrawer()

  return (
    <View style={{ ...styles.horizontalGaps, ...styles.menu }}>
      <TouchableOpacity style={styles.pressable}>
        <MagnifyingGlassIcon color={colors.white} strokeWidth={2} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.pressable}>
        <BellIcon color={colors.white} strokeWidth={2} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.pressable} onPress={open}>
        <Bars3Icon color={colors.white} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  )
}

const getHeaderTitle = (route: RouteProp<ParamListBase>) => {
  if (route.params && "customView" in route.params && typeof route.params.customView === "string") {
    return route.params.customView
  }

  return route.name
}

export const HeaderLeft = () => {
  const route = useRoute()
  const title = getHeaderTitle(route)
  return (
    <View style={styles.horizontalGaps}>
      <Typography style={styles.text}>{title}</Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 24,
    color: colors.white,
  },
  horizontalGaps: {
    paddingHorizontal: 0,
  },
  menu: { flexDirection: "row" },
  pressable: { padding: 8 },
})
