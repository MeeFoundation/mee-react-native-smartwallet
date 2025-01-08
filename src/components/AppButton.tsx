import { hexAlphaColor } from "@utils/color"
import { colors } from "@utils/theme"
import { ComponentPropsWithoutRef, ElementRef, Fragment, forwardRef } from "react"
import { Animated, GestureResponderEvent, Pressable, StyleSheet, TextStyle } from "react-native"
import { SvgProps } from "react-native-svg"
import { Typography } from "./Typography"

type Variant = "primary" | "danger" | "tertiary" | "link"

type Size = "md" | "sm" | "xs"

type AppButtonRef = ElementRef<typeof Pressable>

const ANUMATION_DURATION = 100

const bgColorMap: Record<Variant, [string, string]> = {
  primary: [colors.primary, colors.primaryActive],
  danger: [colors.white, colors.transparentActive],
  tertiary: [colors.transparent, hexAlphaColor(colors.transparentActive, 20)],
  link: [colors.transparent, colors.transparent],
}

const textColorMap: Record<Variant, string> = {
  primary: colors.white,
  danger: colors.danger,
  tertiary: colors.secondary,
  link: colors.link,
}

const paddingsMap = {
  md: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  sm: {
    padding: 10,
  },
  xs: {
    padding: 6,
  },
}

const fontSizeMap = {
  md: 16,
  sm: 16,
  xs: 12,
}

type AppButtonProps = {
  text?: string
  IconLeft?: React.FunctionComponent<SvgProps>
  IconRight?: React.FunctionComponent<SvgProps>
  variant?: Variant
  justifyStart?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
  size?: Size
} & Omit<ComponentPropsWithoutRef<typeof Pressable>, "children">

export const AppButton = forwardRef<AppButtonRef, AppButtonProps>((props, ref) => {
  const {
    children,
    text,
    IconLeft,
    IconRight,
    variant = "primary",
    justifyStart,
    onPress,
    onPressOut,
    size = "md",
    ...rest
  } = props
  const backgroundColorRef = new Animated.Value(0)
  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: bgColorMap[variant],
  })
  const textColor = textColorMap[variant]
  const paddings = variant === "link" ? { paddings: 0 } : paddingsMap[size]
  const textStyles: TextStyle = {
    fontWeight: variant !== "link" ? "700" : "400",
    color: textColor,
    fontSize: fontSizeMap[size],
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
        duration: ANUMATION_DURATION,
      }),
      Animated.timing(borderRef, {
        toValue: 1,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
    ]).start()

    onPress?.(event)
  }

  const onRelease = (event: GestureResponderEvent) => {
    Animated.parallel([
      Animated.timing(backgroundColorRef, {
        toValue: 0,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
      Animated.timing(borderRef, {
        toValue: 0,
        useNativeDriver: true,
        duration: ANUMATION_DURATION,
      }),
    ]).start()

    onPressOut?.(event)
  }

  return (
    <Pressable
      ref={ref}
      role="button"
      style={{ width: props.fullWidth ? "100%" : "auto" }}
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
          ...conditionalStyles,
        }}
      >
        {children ? (
          children
        ) : (
          <Fragment>
            {IconLeft && <IconLeft color={textColor} />}
            <Typography style={textStyles}>{text}</Typography>
            {IconRight && <IconRight color={textColor} />}
          </Fragment>
        )}
      </Animated.View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 10,
  },
  text: { fontWeight: 700 },
})
