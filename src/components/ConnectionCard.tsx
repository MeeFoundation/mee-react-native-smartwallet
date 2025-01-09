import Dots from "@assets/images/dots-vertical.svg"
import TrashSvg from "@assets/images/trash.svg"
import { ChevronDownSvg } from "@assets/index"
import { colors } from "@utils/theme"
import { filterNullable } from "@utils/ts-utils"
import { ImageSourcePropType, StyleSheet, View } from "react-native"
import { AppButton } from "./AppButton"
import { Avatar } from "./Avatar"
import {
  DropdownMenu,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemTitle,
} from "./DropdownMenu"
import { Typography } from "./Typography"

type Props = {
  logo?: ImageSourcePropType
  name: string
  border?: boolean
  onPress?: () => void
  showActionMenu?: boolean
  noBackground?: boolean
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, onPress, showActionMenu } = props
  const { noBackground } = props
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

      {onPress && (
        <ChevronDownSvg
          style={{ transform: [{ rotate: "270deg" }], opacity: 0.7 }}
          onPress={onPress}
        />
      )}

      {showActionMenu && (
        <DropdownMenu
          trigger={
            <AppButton size="sm" variant="tertiary" onPress={() => false}>
              <Dots />
            </AppButton>
          }
        >
          <DropdownMenuItem key="delete-connection" textValue="Delete connection">
            <DropdownMenuItemTitle>Delete connection</DropdownMenuItemTitle>
            <DropdownMenuIcon ios={{ hierarchicalColor: colors.danger, name: "trash" }}>
              <TrashSvg color={colors.danger} />
            </DropdownMenuIcon>
          </DropdownMenuItem>
        </DropdownMenu>
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
