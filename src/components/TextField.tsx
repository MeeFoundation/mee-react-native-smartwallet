import { colors } from "@utils/theme"
import { ComponentProps, FC, useRef } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SvgProps } from "react-native-svg"
type InputSize = "md" | "lg"

export type TextFieldProps = {
  value: string | undefined
  onChangeText: (text: string) => void
  label?: string
  size?: InputSize
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  RightIcon?: React.FunctionComponent<SvgProps>
  RightIconActive?: React.FunctionComponent<SvgProps>
} & ComponentProps<typeof TextInput>

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  onFocus,
  onBlur,
  RightIcon,
  RightIconActive,
  size = "lg",
}) => {
  const inputRef = useRef<TextInput>(null)

  const getInputHeight = (size: InputSize) => {
    if (size === "md") {
      return { height: 44 }
    }
    return { height: 50 }
  }
  const getInputIconSize = (size: InputSize) => {
    if (size === "md") {
      return { right: 16, bottom: 9 }
    }
    return { right: 16, bottom: 13 }
  }

  const inputStyle = StyleSheet.compose(
    inputRef.current?.isFocused()
      ? StyleSheet.compose(styles.input, styles.inputFocus)
      : styles.input,
    getInputHeight(size),
  )

  const iconStyle = StyleSheet.compose(styles.inputIcon, getInputIconSize(size))

  const focusHandler = () => {
    inputRef.current?.focus()
    onFocus && onFocus()
  }

  const blurHandler = () => {
    inputRef.current?.blur()
    onBlur && onBlur()
  }

  const clearHandler = () => {
    onChangeText("")
  }

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={inputStyle}
        placeholderTextColor={colors["gray-400"]}
        onFocus={focusHandler}
        onSubmitEditing={blurHandler}
      />

      {RightIconActive && inputRef.current?.isFocused() && (
        <TouchableOpacity onPress={clearHandler}>
          <RightIconActive
            width={24}
            height={24}
            style={[iconStyle]}
            color={inputRef.current?.isFocused() ? "black" : colors["gray-400"]}
          />
        </TouchableOpacity>
      )}
      {RightIcon && ((RightIconActive && !inputRef.current?.isFocused()) || !RightIconActive) && (
        <TouchableOpacity onPress={focusHandler}>
          <RightIcon
            width={24}
            height={24}
            style={[iconStyle]}
            color={inputRef.current?.isFocused() ? "black" : colors["gray-400"]}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
  },
  inputIcon: {
    color: colors["gray-400"],
    position: "absolute",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    color: colors.secondary,
    marginBottom: 2,
  },
  input: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors["gray-200"],
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  inputFocus: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
})
