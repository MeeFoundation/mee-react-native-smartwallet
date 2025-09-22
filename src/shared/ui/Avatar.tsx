// TODO Refactor
import { colors } from "@/shared/config"
import { generateColorHsl } from "@/shared/lib/color"
import { getImageSource } from "@/shared/lib/get-image-source"
import type { FC } from "react"
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native"

export type AvatarProps = {
  text: string
  src?: ImageSourcePropType | string
  size?: number
  style?: ViewStyle
}

export const Avatar: FC<AvatarProps> = ({ text, src, size = 24, style }) => {
  const bgColor = generateColorHsl(text)

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size },
        !src && { backgroundColor: bgColor },
        style,
      ]}
    >
      {src && <Image source={getImageSource(src)} style={styles.avatarImg} />}
      {!src && <Text style={styles.avatarText}>{text.charAt(0).toUpperCase()}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.white,
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
    lineHeight: 20,
    fontWeight: "bold",
    color: colors.secondary,
  },
})
