import { colors } from "@utils/theme"
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native"
import { Typography } from "./Typography"

type Props = {
  logo?: ImageSourcePropType
}

export const ProviderCard = (props: Props) => {
  const { logo } = props

  return (
    <View style={styles.contaner}>
      <Image source={logo} style={styles.image} />
      <Typography fontFamily="publicSans.bold" style={{ fontWeight: "700" }}>
        Whereas
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  contaner: {
    padding: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  image: { width: 48, height: 48, borderRadius: 9999 },
})
