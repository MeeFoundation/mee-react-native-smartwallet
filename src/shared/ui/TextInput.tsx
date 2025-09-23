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

import { cn } from '../lib/cn'
import { Typography, type TypographyProps } from './Typography'

const PLACEHOLDER_TEXT_COLOR = colors['gray-600']

const textInputVariants = cva(
  'boreder-black/07 color-gray-900 rounded-[8] border bg-white font-400 font-publicSans-regular text-[14px] leading-[20] focus:border-primary',
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
    },
  },
)

type TextInputContext = {
  size: VariantProps<typeof textInputVariants>['size']
  focused: boolean
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
      className={cn(textInputVariants({ invalid, size }), 'px-2.5', 'flex-1', className)}
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
      md: 'h-13 w-13',
      sm: 'h-10 w-10',
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
type TextInputContainerProps = ViewProps & VariantProps<typeof textInputVariants>

const TextInputContainer: FC<TextInputContainerProps> = ({ className, invalid, size, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const value = useMemo(() => ({ focused, setFocused, size }), [focused, size])

  return (
    <TextInputProvider value={value}>
      <View className={cn(textInputVariants({ invalid, size }), 'flex-row gap-2', className)} {...rest} />
    </TextInputProvider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * TextInputLabel
 * -----------------------------------------------------------------------------------------------*/
type TextInputLabelProps = TypographyProps

const TextInputLabel: FC<TextInputLabelProps> = ({ style, ...rest }) => {
  const ctx = useContext(TextInputProvider)

  return (
    <Typography
      style={[
        !ctx?.focused
          ? {
              color: colors['gray-800'],
              fontSize: 16,
              height: 40,
              left: 10,
              outlineColor: colors.primary,
              outlineWidth: 1,
              top: 0,
            }
          : {
              color: colors['gray-900'],
              fontSize: 12,
            },
        { position: 'absolute' },
        style,
      ]}
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
