import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, type FC, useCallback, useContext, useMemo, useState } from 'react'
import {
  type NativeSyntheticEvent,
  TextInput as NativeTextInput,
  type TextInputProps as NativeTextInputProps,
  type TextInputFocusEventData,
  View,
  type ViewProps,
} from 'react-native'

import { colors } from '@/shared/config'

import { cn } from '../lib/styling'
import { Typography, type TypographyProps } from './Typography'

const PLACEHOLDER_TEXT_COLOR = colors['gray-600']

const textInputVariants = cva(
  'boreder rounded-[8] border border-black/7 bg-white px-2.5 font-normal font-publicSans text-[14px] text-gray-900 focus:border-primary',
  {
    defaultVariants: {
      size: 'md',
    },
    variants: {
      invalid: {
        true: 'border-danger',
      },
      size: {
        md: 'h-13',
        sm: 'h-10',
      },
      variant: {
        outline: 'border border-black/7',
        plain: '',
      },
    },
  },
)

type TextInputContext = {
  size: VariantProps<typeof textInputVariants>['size']
  variant: VariantProps<typeof textInputVariants>['variant']
  invalid: VariantProps<typeof textInputVariants>['invalid']
  focused: boolean
  empty: boolean
  setFocused: (focused: boolean) => void
}

const TextInputProvider = createContext<TextInputContext | null>(null)

/* -------------------------------------------------------------------------------------------------
 * TextInput
 * -----------------------------------------------------------------------------------------------*/
type TextInputProps = NativeTextInputProps & VariantProps<typeof textInputVariants>

const TextInput: FC<TextInputProps> = ({ className, invalid, size, ...props }) => {
  const ctx = useContext(TextInputProvider)

  // FIXME handle focused properly or check whether it is possiblee to solve it by css
  const [_focused, setFocused] = useState(false)

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true)
      ctx?.setFocused(true)
      props.onFocus?.(event)
    },
    [props.onFocus, ctx?.setFocused],
  )

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false)
      ctx?.setFocused(false)
      props.onBlur?.(event)
    },
    [props.onBlur, ctx?.setFocused],
  )

  return (
    <NativeTextInput
      {...props}
      className={cn(ctx ? 'h-13 flex-1 px-2.5 pt-4.5' : textInputVariants({ invalid, size }), className)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
      selectionColor={invalid ? colors.danger : undefined}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * TextInputAction
 * -----------------------------------------------------------------------------------------------*/
const actionVariants = cva('', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      md: 'size-13',
      sm: 'size-10',
    },
  },
})

type TextInputActionProps = ViewProps & VariantProps<typeof actionVariants>

const TextInputAction: FC<TextInputActionProps> = ({ className, size, ...rest }) => {
  const ctx = useContext(TextInputProvider)
  return <View className={cn(actionVariants({ size: size || ctx?.size }), className)} {...rest} />
}

/* -------------------------------------------------------------------------------------------------
 * TextInputActions
 * -----------------------------------------------------------------------------------------------*/
type TextInputActionsProps = ViewProps

const TextInputActions: FC<TextInputActionsProps> = ({ className, ...rest }) => (
  <View className={cn('flex-row items-center', className)} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * TextInputContainer
 * -----------------------------------------------------------------------------------------------*/
const textInputContainerVariants = cva('rounded-lg border', {
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
  variants: {
    invalid: {
      true: 'border-danger',
    },
    size: {
      md: 'h-13',
      sm: 'h-10',
    },
    variant: {
      outline: 'border-black/7',
      plain: 'border-transparent',
    },
  },
})

type TextInputContainerProps = ViewProps & VariantProps<typeof textInputContainerVariants> & { empty?: boolean }

const TextInputContainer: FC<TextInputContainerProps> = ({ className, invalid, size, empty, variant, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const ctxValue = useMemo(
    () => ({ empty: !!empty, focused, invalid, setFocused, size, variant }),
    [focused, size, empty, variant, invalid],
  )

  return (
    <TextInputProvider value={ctxValue}>
      <View
        className={cn(
          textInputContainerVariants({ invalid, size, variant }),
          focused && 'border border-primary bg-white',
          'h-13 flex-row items-center gap-2',
          className,
        )}
        {...rest}
      />
    </TextInputProvider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * TextInputLabel
 * -----------------------------------------------------------------------------------------------*/
type TextInputLabelProps = TypographyProps

const TextInputLabel: FC<TextInputLabelProps> = ({ className, ...rest }) => {
  const ctx = useContext(TextInputProvider)

  return (
    <Typography
      className={cn(
        'absolute left-2.5',
        ctx?.focused || !ctx?.empty ? 'top-1.5 text-gray-900 text-xs' : 'top-3.5 text-base text-gray-800',
        className,
      )}
      {...rest}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

export {
  TextInput as Input,
  TextInputContainer as Root,
  TextInputActions as Actions,
  TextInputLabel as Label,
  TextInputAction as Action,
}

export { TextInput, TextInputContainer, TextInputActions, TextInputLabel, TextInputAction }

export type {
  TextInputProps,
  TextInputActionsProps,
  TextInputContainerProps,
  TextInputLabelProps,
  TextInputActionProps,
}

export { PLACEHOLDER_TEXT_COLOR }
