import { useRoute } from "@react-navigation/native"
import { customHeader } from "@store/index"
import { colors } from "@utils/theme"
import { useAtomValue } from "jotai"
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

export const HeaderLeft = () => {
  const route = useRoute()
  const custom = useAtomValue(customHeader)
  return (
    <View style={styles.horizontalGaps}>
      <Typography style={styles.text}>{custom && custom.length ? custom : route.name}</Typography>
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
