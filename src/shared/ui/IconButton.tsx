import type { FC } from 'react'
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native'

import { colors } from '@/shared/config'
import { assertUnreachable } from '@/shared/lib/assert-unreachable'

import { IconSymbol, type IconSymbolName } from './IconSymbol'

const iconButtonStyles = StyleSheet.create({
  icon: {
    outlineColor: 'red',
    outlineWidth: 1,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    outlineColor: colors.primary,
    outlineWidth: 1,
  },
  iconButtonMd: { height: 48, width: 48 },
  iconButtonSm: { height: 40, width: 40 },
  iconMd: { height: 24, width: 24 },
  iconSm: { height: 24, width: 24 },
})

/* -------------------------------------------------------------------------------------------------
 * IconButton
 * -----------------------------------------------------------------------------------------------*/
type IconButtonSize = 'sm' | 'md'

const resolveButtonSizeStyle = (size: IconButtonSize = 'md') => {
  switch (size) {
    case 'sm':
      return iconButtonStyles.iconButtonSm
    case 'md':
      return iconButtonStyles.iconButtonMd
    default:
      assertUnreachable(size)
      return iconButtonStyles.iconButton
  }
}

const resolveIconSizeStyle = (size: IconButtonSize = 'md') => {
  switch (size) {
    case 'sm':
      return iconButtonStyles.iconSm
    case 'md':
      return iconButtonStyles.iconMd
    default:
      assertUnreachable(size)
      return iconButtonStyles.icon
  }
}

type IconButtonProps = TouchableOpacityProps & {
  icon: IconSymbolName
  size?: IconButtonSize
}

const IconButton: FC<IconButtonProps> = ({ style, icon, size, ...props }) => (
  <TouchableOpacity {...props} style={[iconButtonStyles.iconButton, resolveButtonSizeStyle(size), style]}>
    <IconSymbol name={icon} style={[iconButtonStyles.icon, resolveIconSizeStyle(size)]} />
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { IconButton }

export type { IconButtonProps }

export { iconButtonStyles }
