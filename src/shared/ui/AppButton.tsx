// TODO Refactor

import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type FC,
  Fragment,
  type ReactNode,
  type RefObject,
} from 'react'
import { Animated, type GestureResponderEvent, Pressable, StyleSheet, type TextStyle, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import { colors } from '@/shared/config'
import { hexAlphaColor } from '@/shared/lib/styling'
import { Typography } from '@/shared/ui/Typography'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'tertiary' | 'link' | 'link_danger'

type Size = 'md' | 'sm' | 'xs' | 'lg'

type AppButtonRef = ElementRef<typeof Pressable>

const ANIMATION_DURATION = 100

const bgColorMap: Record<ButtonVariant, [string, string]> = {
  danger: [colors.white, colors.transparentActive],
  link: [colors.transparent, colors.transparent],
  link_danger: [colors.transparent, colors.transparent],
  // TODO make better semantic colors
  primary: [colors.primary, colors.primaryActive],
  secondary: [colors.white, colors.transparentActive],
  tertiary: [colors.transparent, hexAlphaColor(colors.transparentActive, 20)],
}

const textColorMap: Record<ButtonVariant, string> = {
  danger: colors.danger,
  link: colors.link,
  link_danger: colors.danger,
  primary: colors.white,
  secondary: colors.primary,
  tertiary: colors.secondary,
}

const paddingsMap = {
  lg: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  md: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  sm: {
    padding: 10,
  },
  xs: {
    padding: 6,
  },
}

const fontSizeMap = {
  lg: 20,
  md: 16,
  sm: 16,
  xs: 12,
}

type AppButtonProps = {
  text?: string
  leftElement?: ReactNode
  IconLeft?: React.FunctionComponent<SvgProps>
  IconRight?: React.FunctionComponent<SvgProps>
  variant?: ButtonVariant
  justifyStart?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
  size?: Size
  textStyles?: TextStyle
  ref?: RefObject<AppButtonRef | null>
} & Omit<ComponentPropsWithoutRef<typeof Pressable>, 'children'>

export const AppButton: FC<AppButtonProps> = (props) => {
  const {
    children,
    leftElement,
    text,
    IconLeft,
    IconRight,
    variant = 'primary',
    justifyStart,
    onPress,
    onPressOut,
    size = 'md',
    textStyles: tStyles = {},
    ref,
    ...rest
  } = props
  const backgroundColorRef = new Animated.Value(0)
  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: bgColorMap[variant],
  })
  const textColor = tStyles?.color ?? textColorMap[variant]
  const paddings = ['link', 'link_danger'].includes(variant) ? { paddings: 0 } : paddingsMap[size]
  const textStyles: TextStyle = {
    color: textColor,
    fontSize: fontSizeMap[size],
    fontWeight: !['link', 'link_danger'].includes(variant) ? '700' : '400',
    ...tStyles,
  }

  const borderRef = new Animated.Value(0)
  const borderColor = borderRef.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.transparent, colors.transparentActive],
  })

  const conditionalStyles = variant === 'tertiary' ? { borderColor, borderWidth: 1 } : {}

  const handlePress = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(borderRef, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start()

    onPress?.(event)
  }

  const onRelease = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(borderRef, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start()

    onPressOut?.(event)
  }

  return (
    <View style={StyleSheet.flatten(props.fullWidth && { flexDirection: 'row', width: '100%' })}>
      <Pressable
        onPress={handlePress}
        onPressOut={onRelease}
        ref={ref}
        role="button"
        style={[{ width: props.fullWidth ? '100%' : 'auto' }]}
        {...rest}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: justifyStart ? 'space-between' : 'center',
            ...paddings,
            ...styles.container,
            backgroundColor,
            ...styles[variant],
            ...conditionalStyles,
          }}
        >
          {children ? (
            children
          ) : (
            <Fragment>
              {leftElement}
              {IconLeft && <IconLeft color={textColor} />}
              <Typography style={textStyles}>{text}</Typography>
              {IconRight && <IconRight color={textColor} />}
            </Fragment>
          )}
        </Animated.View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
  },
  danger: {},
  link: {},
  link_danger: {},
  primary: {},
  secondary: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  tertiary: {},
  text: { fontWeight: 700 },
})
