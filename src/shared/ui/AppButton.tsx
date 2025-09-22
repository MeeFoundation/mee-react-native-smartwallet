// TODO Refactor
import { colors } from "@/shared/config"
import { hexAlphaColor } from "@/shared/lib/color"
import { Typography } from "@/shared/ui/Typography"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type FC,
  Fragment,
  type ReactNode,
  type RefObject,
} from "react"
import {
  Animated,
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
  type TextStyle,
  View,
} from "react-native"
import type { SvgProps } from "react-native-svg"

export type ButtonVariant = "primary" | "secondary" | "danger" | "tertiary" | "link" | "link_danger"

type Size = "md" | "sm" | "xs" | "lg"

type AppButtonRef = ElementRef<typeof Pressable>

const ANIMATION_DURATION = 100

const bgColorMap: Record<ButtonVariant, [string, string]> = {
  // TODO make better semantic colors
  primary: [colors.primary, colors.primaryActive],
  secondary: [colors.white, colors.transparentActive],
  danger: [colors.white, colors.transparentActive],
  tertiary: [colors.transparent, hexAlphaColor(colors.transparentActive, 20)],
  link: [colors.transparent, colors.transparent],
  link_danger: [colors.transparent, colors.transparent],
}

const textColorMap: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.primary,
  danger: colors.danger,
  tertiary: colors.secondary,
  link: colors.link,
  link_danger: colors.danger,
}

const paddingsMap = {
  md: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  sm: {
    padding: 10,
  },
  xs: {
    padding: 6,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 16,
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
} & Omit<ComponentPropsWithoutRef<typeof Pressable>, "children">

export const AppButton: FC<AppButtonProps> = (props) => {
  const {
    children,
    leftElement,
    text,
    IconLeft,
    IconRight,
    variant = "primary",
    justifyStart,
    onPress,
    onPressOut,
    size = "md",
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
  const paddings = ["link", "link_danger"].includes(variant) ? { paddings: 0 } : paddingsMap[size]
  const textStyles: TextStyle = {
    fontWeight: !["link", "link_danger"].includes(variant) ? "700" : "400",
    color: textColor,
    fontSize: fontSizeMap[size],
    ...tStyles,
  }

  const borderRef = new Animated.Value(0)
  const borderColor = borderRef.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.transparent, colors.transparentActive],
  })

  const conditionalStyles = variant === "tertiary" ? { borderColor, borderWidth: 1 } : {}

  const handlePress = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        toValue: 1,
        useNativeDriver: true,
        duration: ANIMATION_DURATION,
      }),
      Animated.timing(borderRef, {
        toValue: 1,
        useNativeDriver: true,
        duration: ANIMATION_DURATION,
      }),
    ]).start()

    onPress?.(event)
  }

  const onRelease = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        toValue: 0,
        useNativeDriver: true,
        duration: ANIMATION_DURATION,
      }),
      Animated.timing(borderRef, {
        toValue: 0,
        useNativeDriver: true,
        duration: ANIMATION_DURATION,
      }),
    ]).start()

    onPressOut?.(event)
  }

  return (
    <View style={StyleSheet.flatten(props.fullWidth && { width: "100%", flexDirection: "row" })}>
      <Pressable
        ref={ref}
        role="button"
        style={[{ width: props.fullWidth ? "100%" : "auto" }]}
        onPress={handlePress}
        onPressOut={onRelease}
        {...rest}
      >
        <Animated.View
          style={{
            justifyContent: justifyStart ? "space-between" : "center",
            alignItems: "center",
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
    flexDirection: "row",
    gap: 12,
    borderRadius: 10,
  },
  text: { fontWeight: 700 },
  primary: {},
  secondary: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  danger: {},
  tertiary: {},
  link: {},
  link_danger: {},
})
