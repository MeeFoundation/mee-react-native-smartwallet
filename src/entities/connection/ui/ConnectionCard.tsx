import { colors, fonts } from "@/shared/config"
import { filterNullable } from "@/shared/lib/ts-utils"
import { AppButton } from "@/shared/ui/AppButton"
import { Avatar } from "@/shared/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@/shared/ui/DropdownMenu"
import { Typography } from "@/shared/ui/Typography"
import { type ReactElement } from "react"
import { type ImageSourcePropType, StyleSheet, Text, View, type ViewStyle } from "react-native"
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline"

type Icons = "pencil" | "trash" | "userGroup" | "link"
export type MenuAction = {
  name: string
  key: "edit" | "link" | "delete" | "source-profile"
  icon: Icons
  onPress: () => void
}

type Props = {
  logo?: ImageSourcePropType | string
  name: string
  border?: boolean
  style?: ViewStyle
  menuActions?: MenuAction[]
}

const IconTextToComponentMap: Record<Icons, ReactElement> = {
  trash: (
    <DropdownMenuIcon
      ios={{ hierarchicalColor: colors.danger, name: "trash" }}
      androidIconName="ic_trash"
    >
      <TrashIcon color={colors.danger} />
    </DropdownMenuIcon>
  ),
  userGroup: (
    <DropdownMenuIcon
      ios={{ hierarchicalColor: "black", name: "person.3" }}
      androidIconName="ic_user_group"
    >
      <TrashIcon color={colors.danger} />
    </DropdownMenuIcon>
  ),
  pencil: (
    <DropdownMenuIcon
      ios={{ hierarchicalColor: "black", name: "square.and.pencil" }}
      androidIconName="ic_pencil_square"
    >
      <PencilSquareIcon color="black" />
    </DropdownMenuIcon>
  ),
  link: (
    <DropdownMenuIcon ios={{ hierarchicalColor: "black", name: "link" }} androidIconName="ic_link">
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
        <Typography style={styles.name} fontFamily={fonts.publicSans.bold} weight="500">
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
                  color={colors.danger}
                >
                  <DropdownMenuItemTitle>
                    <Text style={{ color: colors.danger }}>{action.name}</Text>
                  </DropdownMenuItemTitle>
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
  itemText: {
    color: "#FF9800",
    fontSize: 16,
    marginLeft: 8,
  },
})
