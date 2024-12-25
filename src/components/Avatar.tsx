import { generateColorHsl } from "@utils/color"
import { colors } from "@utils/theme"
import { FC } from "react"
import { StyleSheet, Text, View, ViewStyle } from "react-native"

type AvatarProps = {
  text: string
  src?: string
  size?: number
  style?: ViewStyle
}

export const Avatar: FC<AvatarProps> = ({ text, src, size = 24, style }) => {
  const bgColor = generateColorHsl(text)

  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: bgColor }, style]}>
      <Text style={styles.avatarText}>{text.charAt(0).toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.secondary,
  },
})
