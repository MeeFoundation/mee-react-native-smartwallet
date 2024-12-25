import CloseIcon from "@assets/images/close.svg"
import SearchIcon from "@assets/images/search.svg"
import { colors } from "@utils/theme"
import { ComponentProps, FC, useRef } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

type TextFieldProps = {
  value: string
  onChangeText: (text: string) => void
  label?: string
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
} & ComponentProps<typeof TextInput>

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<TextInput>(null)

  const inputStyle = inputRef.current?.isFocused()
    ? StyleSheet.compose(styles.input, styles.inputFocus)
    : styles.input

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
        onFocus={focusHandler}
        onSubmitEditing={blurHandler}
      />
      {inputRef.current?.isFocused() ? (
        <TouchableOpacity onPress={clearHandler}>
          <CloseIcon width={24} height={24} style={[styles.inputIcon, { color: "black" }]} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={focusHandler}>
          <SearchIcon width={24} height={24} style={styles.inputIcon} />
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
    right: 16,
    bottom: 13,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: colors.secondary,
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors["gray-200"],
    borderRadius: 8,
  },
  inputFocus: {
    borderColor: colors.primary,
  },
})
