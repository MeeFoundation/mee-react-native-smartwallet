import { BlurView } from "@react-native-community/blur"
import { colors } from "@utils/theme"
import { filterNullable } from "@utils/ts-utils"
import { ImageSourcePropType, StyleSheet, View } from "react-native"
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline"
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
      // !noBackground && { backgroundColor: colors.surface },
    ]),
  )

  return (
    <View>
      <View style={containerStyles}>
        <Avatar src={logo} text={name} size={48} />
        <Typography style={styles.name} fontFamily="publicSans.bold" weight="500">
          {name}
        </Typography>

        {/* {onPress && <ChevronRightIcon opacity={0.7} onPress={onPress} color="black" />} */}

        {showActionMenu && (
          <DropdownMenu
            trigger={
              <AppButton size="sm" variant="tertiary" onPress={() => false}>
                <EllipsisVerticalIcon color="black" />
              </AppButton>
            }
          >
            <DropdownMenuItem key="manage-connection" textValue="Manage connection">
              <DropdownMenuItemTitle>Manage connection</DropdownMenuItemTitle>
              <DropdownMenuIcon ios={{ hierarchicalColor: "black", name: "square.and.pencil" }}>
                <PencilSquareIcon color="black" />
              </DropdownMenuIcon>
            </DropdownMenuItem>
            <DropdownMenuItem key="link-connection" textValue="Link connection">
              <DropdownMenuItemTitle>Link connection</DropdownMenuItemTitle>
              <DropdownMenuIcon ios={{ hierarchicalColor: "black", name: "square.and.pencil" }}>
                <PencilSquareIcon color="black" />
              </DropdownMenuIcon>
            </DropdownMenuItem>
            <DropdownMenuItem key="delete-connection" textValue="Delete connection">
              <DropdownMenuItemTitle>Delete connection</DropdownMenuItemTitle>
              <DropdownMenuIcon ios={{ hierarchicalColor: colors.danger, name: "trash" }}>
                <TrashIcon color={colors.danger} />
              </DropdownMenuIcon>
            </DropdownMenuItem>
          </DropdownMenu>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contaner: {
    padding: 8,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  image: { width: 48, height: 48, borderRadius: 9999 },
  open: { color: colors.link, fontSize: 12 },
  name: { flexGrow: 1 },
  border: { borderColor: colors.primary, borderWidth: 2 },
})
