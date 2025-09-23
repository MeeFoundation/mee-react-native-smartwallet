import type { FC } from 'react'
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native'

import { assertUnreachable } from '@/shared/lib/assert-unreachable'

import { IconSymbol, type IconSymbolName } from './IconSymbol'

const iconButtonStyles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    outlineColor: 'red',
    outlineWidth: 1,
  },
  iconButtonFull: { height: '100%', width: '100%' },
  iconButtonMd: { height: 48, width: 48 },
  iconButtonSm: { height: 40, width: 40 },
  iconFull: { height: '100%', width: '100%' },
  iconMd: { height: 24, width: 24 },
  iconSm: { height: 24, width: 24 },
})

/* -------------------------------------------------------------------------------------------------
 * IconButton
 * -----------------------------------------------------------------------------------------------*/
type IconButtonSize = 'sm' | 'md' | 'full'

const resolveButtonSizeStyle = (size: IconButtonSize = 'md') => {
  switch (size) {
    case 'sm':
      return iconButtonStyles.iconButtonSm
    case 'md':
      return iconButtonStyles.iconButtonMd
    case 'full':
      return iconButtonStyles.iconButtonFull
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
    case 'full':
      return iconButtonStyles.iconMd
    default:
      assertUnreachable(size)
      return undefined
  }
}

type IconButtonProps = TouchableOpacityProps & {
  icon: IconSymbolName
  size?: IconButtonSize
  color?: string
}

const IconButton: FC<IconButtonProps> = ({ style, icon, size, color, ...props }) => (
  <TouchableOpacity {...props} style={[iconButtonStyles.iconButton, resolveButtonSizeStyle(size), style]}>
    <IconSymbol name={icon} style={resolveIconSizeStyle(size)} />
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { IconButton }

export type { IconButtonProps }

export { iconButtonStyles }
