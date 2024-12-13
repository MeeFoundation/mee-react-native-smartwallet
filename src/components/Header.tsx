import BellIcon from "@assets/images/bell.svg"
import { useRoute } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { StyleSheet, Text, View } from "react-native"

export const HeaderRight = () => {
  return (
    <View style={styles.blockPaddings}>
      <BellIcon />
    </View>
  )
}

export const HeaderLeft = () => {
  const route = useRoute()

  return (
    <View style={styles.blockPaddings}>
      <Text>{route.name}</Text>
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
  blockPaddings: {
    paddingHorizontal: 16,
  },
})
