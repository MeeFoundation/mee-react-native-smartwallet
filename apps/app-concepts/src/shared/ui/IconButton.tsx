import { cva, type VariantProps } from 'class-variance-authority'
import type { FC } from 'react'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'

import { cn } from '../lib/styling'
import { IconSymbol, type IconSymbolName } from './IconSymbol'

const iconButtonVariants = cva('items-center justify-center', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      full: 'size-full',
      md: 'size-12',
      sm: 'size-11',
      xs: 'size-10',
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * IconButton
 * -----------------------------------------------------------------------------------------------*/
type IconButtonProps = TouchableOpacityProps &
  VariantProps<typeof iconButtonVariants> & {
    icon: IconSymbolName
    strokeWidth?: number
    iconClassName?: string
  }

const IconButton: FC<IconButtonProps> = ({ className, icon, size, strokeWidth = 2, iconClassName, ...props }) => (
  <TouchableOpacity className={cn(iconButtonVariants({ size }), className)} {...props}>
    <IconSymbol className={cn('size-6', iconClassName)} name={icon} strokeWidth={strokeWidth} />
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { IconButton }

export type { IconButtonProps }
