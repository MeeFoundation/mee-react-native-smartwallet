import Dots from "@assets/images/dots-vertical.svg"
import { ChevronDownSvg } from "@assets/index"
import { colors } from "@utils/theme"
import { ImageSourcePropType, StyleSheet, View } from "react-native"
import { AppButton } from "./AppButton"
import { Avatar } from "./Avatar"
import { Typography } from "./Typography"

type Props = {
  logo?: ImageSourcePropType
  name: string
  border?: boolean
  onOpenPress?: () => void
  showActionMenu?: boolean
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, onOpenPress, showActionMenu } = props

  return (
    <View style={StyleSheet.compose(styles.contaner, border && styles.border)}>
      <Avatar src={logo} text={name} size={48} />
      <Typography style={styles.name} fontFamily="publicSans.bold" weight="500">
        {name}
      </Typography>

      {onOpenPress && (
        <ChevronDownSvg
          style={{ transform: [{ rotate: "270deg" }], opacity: 0.7 }}
          onPress={onOpenPress}
        />
      )}

      {showActionMenu && (
        <AppButton size="sm" variant="tertiary" onPress={() => false}>
          <Dots />
        </AppButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contaner: {
    padding: 8,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.surface,
  },
  image: { width: 48, height: 48, borderRadius: 9999 },
  open: { color: colors.link, fontSize: 12 },
  name: { flexGrow: 1 },
  border: { borderColor: colors.primary, borderWidth: 2 },
})
