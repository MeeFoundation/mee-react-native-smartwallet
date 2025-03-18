import { colors } from "@utils/theme"
import { filterNullable } from "@utils/ts-utils"
import { ImageSourcePropType, StyleSheet, View, ViewStyle } from "react-native"
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline"
import { AppButton } from "./AppButton"
import { Avatar } from "./Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu"
import { Typography } from "./Typography"

type Props = {
  logo?: ImageSourcePropType | string
  name: string
  border?: boolean
  onPress?: () => void
  showActionMenu?: boolean
  style?: ViewStyle
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, onPress, showActionMenu, style } = props
  const containerStyles = StyleSheet.flatten(
    filterNullable([styles.contaner, border && styles.border, style]),
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AppButton size="sm" variant="tertiary" onPress={() => false}>
                <EllipsisVerticalIcon color="black" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
                <PencilSquareIcon color="black" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem key="delete-connection" textValue="Delete connection">
                <DropdownMenuItemTitle color={colors.danger}>
                  Delete connection
                </DropdownMenuItemTitle>
                <DropdownMenuIcon
                  ios={{ hierarchicalColor: colors.danger, name: "trash" }}
                  androidIconName="ic_menu_delete"
                >
                  <TrashIcon color={colors.danger} />
                </DropdownMenuIcon>
              </DropdownMenuItem>
            </DropdownMenuContent>
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
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  image: { width: 48, height: 48, borderRadius: 9999 },
  open: { color: colors.link, fontSize: 12 },
  name: { flexGrow: 1 },
  border: { borderColor: colors.primary, borderWidth: 2 },
})
