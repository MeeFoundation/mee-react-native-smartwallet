import BellIcon from "@assets/images/bell.svg"
import MenuIcon from "@assets/images/menu.svg"
import SearchIcon from "@assets/images/search.svg"
import { useRoute } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { StyleSheet, View } from "react-native"
import { Typography } from "./Typography"

export const HeaderRight = () => {
  return (
    <View style={{ ...styles.horizontalGaps, ...styles.menu }}>
      <SearchIcon />
      <BellIcon />
      <MenuIcon />
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
