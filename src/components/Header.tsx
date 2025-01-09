import { BellSvg, MenuIconSvg, SearchSvg } from "@assets/index"
import { useRoute } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useDrawer } from "./Drawer"
import { Typography } from "./Typography"

export const HeaderRight = () => {
  const { open } = useDrawer()

  return (
    <View style={{ ...styles.horizontalGaps, ...styles.menu }}>
      <SearchSvg />
      <BellSvg />
      <TouchableOpacity onPress={open}>
        <MenuIconSvg />
      </TouchableOpacity>
    </View>
  )
}

export const HeaderLeft = () => {
  const route = useRoute()

  return (
    <View style={styles.horizontalGaps}>
      <Typography style={styles.text}>{route.name}</Typography>
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
  menu: {
    flexDirection: "row",
    gap: 8,
  },
})
