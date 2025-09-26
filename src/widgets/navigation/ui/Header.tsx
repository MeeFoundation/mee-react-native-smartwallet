import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, type FC, useContext, useMemo } from 'react'
import { View, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/shared/lib/cn'
import { IconButton, type IconButtonProps } from '@/shared/ui/IconButton'
import { Typography, type TypographyProps } from '@/shared/ui/Typography'

type HeaderContext = {
  variant: 'default' | 'primary' | undefined
}

const DEFAULT_VARIANT = 'default'

export const HeaderProvider = createContext<HeaderContext>({
  variant: DEFAULT_VARIANT,
})

/* -------------------------------------------------------------------------------------------------
 * HeaderIconButton
 * -----------------------------------------------------------------------------------------------*/
const headerIconButtonVariants = cva('', {
  variants: {
    defaultVariants: {
      variant: 'default',
    },
    variant: {
      default: 'text-blue-700',
      primary: 'text-white',
    },
  },
})
type HeaderIconButtonProps = IconButtonProps & VariantProps<typeof headerIconButtonVariants>

const HeaderIconButton: FC<HeaderIconButtonProps> = ({ variant, iconClassName, ...rest }) => {
  const ctx = useContext(HeaderProvider)

  return (
    <IconButton
      iconClassName={cn(headerIconButtonVariants({ variant: variant ?? ctx.variant }), iconClassName)}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * HeaderActions
 * -----------------------------------------------------------------------------------------------*/
type HeaderActionsProps = ViewProps & {
  position: 'left' | 'right'
}

const HeaderActions: FC<HeaderActionsProps> = ({ className, position, ...rest }) => (
  <View
    className={cn(
      'flex-row items-center justify-center',
      position === 'left' ? 'justify-start' : 'justify-end',
      className,
    )}
    style={{ flex: 1 }}
    {...rest}
  />
)

/* -------------------------------------------------------------------------------------------------
 * HeaderTitleText
 * -----------------------------------------------------------------------------------------------*/
const headerTitleTextVariants = cva('text-lg', {
  variants: {
    defaultVariants: {
      variant: 'default',
    },
    variant: {
      default: 'font-semibold text-gray-900',
      primary: 'font-bold text-white',
    },
  },
})

type HeaderTitleTextProps = TypographyProps & VariantProps<typeof headerTitleTextVariants>

const HeaderTitleText: FC<HeaderTitleTextProps> = ({ className, variant, ...rest }) => {
  const ctx = useContext(HeaderProvider)

  return (
    <Typography className={cn(headerTitleTextVariants({ variant: variant ?? ctx.variant }), className)} {...rest} />
  )
}

/* -------------------------------------------------------------------------------------------------
 * HeaderTitle
 * -----------------------------------------------------------------------------------------------*/
type HeaderTitleProps = ViewProps & {}

const HeaderTitle: FC<HeaderTitleProps> = ({ className, ...rest }) => (
  <View
    className={cn('pointer-events-none absolute right-0 left-0 flex-row items-center justify-center gap-1', className)}
    {...rest}
  />
)

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/
const headerVariants = cva('', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'border-b border-b-black/5 bg-white/80 pb-0',
      primary: 'bg-primary pb-3.5',
    },
  },
})

type HeaderProps = ViewProps & VariantProps<typeof headerVariants>

const Header: FC<HeaderProps> = ({ className, variant, ...rest }) => {
  const value = useMemo(() => ({ variant: variant ?? DEFAULT_VARIANT }), [variant])
  const insets = useSafeAreaInsets()

  return (
    <View className={cn(headerVariants({ variant }), className)} style={{ paddingTop: insets.top }}>
      <HeaderProvider value={value}>
        <View className="mx-3 mt-1 min-h-11 flex-row items-center justify-center" {...rest} />
      </HeaderProvider>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export {
  Header as Root,
  HeaderActions as Actions,
  HeaderTitle as Title,
  HeaderTitleText as TitleText,
  HeaderIconButton as IconButton,
}

export { Header, HeaderActions, HeaderTitle, HeaderTitleText, HeaderIconButton }

export type { HeaderProps, HeaderActionsProps, HeaderTitleProps, HeaderTitleTextProps, HeaderIconButtonProps }
