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
  DropdownMenuTrigger,
} from "./DropdownMenu"
import { Typography } from "./Typography"

type Props = {
  logo?: ImageSourcePropType | string
  name: string
  border?: boolean
  style?: ViewStyle
  menuActions?: {
    name: string
    key: "edit" | "link" | "delete"
    icon: "pencil" | "trash"
    onPress: () => void
  }[]
}

const IconTextToComponentMap: Record<"pencil" | "trash", JSX.Element> = {
  trash: (
    <DropdownMenuIcon ios={{ hierarchicalColor: colors.danger, name: "trash" }}>
      <TrashIcon color={colors.danger} />
    </DropdownMenuIcon>
  ),
  pencil: (
    <DropdownMenuIcon
      ios={{ hierarchicalColor: "black", name: "pencil" }}
      androidIconName="ic_menu_delete"
    >
      <PencilSquareIcon color="black" />
    </DropdownMenuIcon>
  ),
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, style, menuActions } = props
  const containerStyles = StyleSheet.flatten(
    filterNullable([styles.container, border && styles.border, style]),
  )

  return (
    <View>
      <View style={containerStyles}>
        <Avatar src={logo} text={name} size={48} />
        <Typography style={styles.name} fontFamily="publicSans.bold" weight="500">
          {name}
        </Typography>

        {menuActions && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AppButton size="sm" variant="tertiary" onPress={() => false}>
                <EllipsisVerticalIcon color="black" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {menuActions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  onSelect={action.onPress}
                  textValue={action.name}
                >
                  <DropdownMenuItemTitle>{action.name}</DropdownMenuItemTitle>
                  {IconTextToComponentMap[action.icon]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
