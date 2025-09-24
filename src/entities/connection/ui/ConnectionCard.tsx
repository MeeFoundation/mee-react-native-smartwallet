import type { ReactElement } from 'react'
import { type ImageSourcePropType, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { filterNullable } from '@/shared/lib/ts-utils'
import { AppButton } from '@/shared/ui/AppButton'
import { Avatar } from '@/shared/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import { Typography } from '@/shared/ui/Typography'

type Icons = 'pencil' | 'trash' | 'userGroup' | 'link'
export type MenuAction = {
  name: string
  key: 'edit' | 'link' | 'delete' | 'source-profile'
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
  link: (
    <DropdownMenuIcon androidIconName="ic_link" ios={{ hierarchicalColor: 'black', name: 'link' }}>
      <PencilSquareIcon color="black" />
    </DropdownMenuIcon>
  ),
  pencil: (
    <DropdownMenuIcon
      androidIconName="ic_pencil_square"
      ios={{ hierarchicalColor: 'black', name: 'square.and.pencil' }}
    >
      <PencilSquareIcon color="black" />
    </DropdownMenuIcon>
  ),
  trash: (
    <DropdownMenuIcon androidIconName="ic_trash" ios={{ hierarchicalColor: colors.danger, name: 'trash' }}>
      <TrashIcon color={colors.danger} />
    </DropdownMenuIcon>
  ),
  userGroup: (
    <DropdownMenuIcon androidIconName="ic_user_group" ios={{ hierarchicalColor: 'black', name: 'person.3' }}>
      <TrashIcon color={colors.danger} />
    </DropdownMenuIcon>
  ),
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, style, menuActions } = props
  const containerStyles = StyleSheet.flatten(filterNullable([styles.container, border && styles.border, style]))

  return (
    <View>
      <View style={containerStyles}>
        <Avatar size={48} src={logo} text={name} />
        <Typography className="font-medium" style={styles.name}>
          {name}
        </Typography>

        {menuActions && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AppButton onPress={() => false} size="sm" variant="tertiary">
                <EllipsisVerticalIcon color="black" />
              </AppButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {menuActions.map((action) => (
                <DropdownMenuItem
                  color={colors.danger}
                  key={action.key}
                  onSelect={action.onPress}
                  textValue={action.name}
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
  border: { borderColor: colors.primary, borderWidth: 2 },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  image: { borderRadius: 9999, height: 48, width: 48 },
  itemText: {
    color: '#FF9800',
    fontSize: 16,
    marginLeft: 8,
  },
  name: { flexGrow: 1 },
  open: { color: colors.link, fontSize: 12 },
})
