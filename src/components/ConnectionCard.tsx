import Dots from "@assets/images/dots-vertical.svg"
import { colors } from "@utils/theme"
import { filterNullable } from "@utils/ts-utils"
import { ImageSourcePropType, StyleSheet, View } from "react-native"
import { AppButton } from "./AppButton"
import { Avatar } from "./Avatar"
import { Typography } from "./Typography"

type Props = {
  logo?: ImageSourcePropType
  name: string
  border?: boolean
  onPress?: () => void
  buttonLabel?: string
  showActionMenu?: boolean
  noBackground?: boolean
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, onPress, showActionMenu } = props
  const { buttonLabel = "Open", noBackground } = props
  const containerStyles = StyleSheet.flatten(
    filterNullable([
      styles.contaner,
      border && styles.border,
      !noBackground && { backgroundColor: colors.surface },
    ]),
  )

  return (
    <View style={containerStyles}>
      <Avatar src={logo} text={name} size={48} />
      <Typography style={styles.name} fontFamily="publicSans.bold" weight="500">
        {name}
      </Typography>

      {onPress && <AppButton text={buttonLabel} variant="link" size="xs" onPress={onPress} />}

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
  },
  image: { width: 48, height: 48, borderRadius: 9999 },
  open: { color: colors.link, fontSize: 12 },
  name: { flexGrow: 1 },
  border: { borderColor: colors.primary, borderWidth: 2 },
})
