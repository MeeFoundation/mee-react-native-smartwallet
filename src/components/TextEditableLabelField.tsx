import { FC } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { InputSize, TextField } from "./TextField"

export type TextEditableLabelFieldProps = {
  value: string | undefined
  labelValue: string | undefined
  label: string | undefined
  labelLabel: string | undefined
  onChangeText: (text: string) => void
  onChangeLabel: (text: string) => void
  size?: InputSize
  style?: ViewStyle
  placeholder?: string
  labelPlaceholder?: string
  errorText?: string
  labelErrorText?: string
  disabled?: boolean
}

export const TextEditableLabelField: FC<TextEditableLabelFieldProps> = ({
  value,
  labelValue,
  label,
  labelLabel,
  onChangeText,
  onChangeLabel,
  placeholder,
  labelPlaceholder,
  style,
  size = "lg",
  errorText,
  labelErrorText,
  disabled,
}) => {
  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <TextField
        value={labelValue}
        label={labelLabel}
        isLabelInside
        disabled={disabled}
        size={size}
        onChangeText={onChangeLabel}
        placeholder={labelPlaceholder}
        propsStyles={{ input: styles.inputTop }}
        errorText={labelErrorText}
      />
      <TextField
        value={value}
        label={label}
        isLabelInside
        disabled={disabled}
        size={size}
        onChangeText={onChangeText}
        placeholder={placeholder}
        propsStyles={{ input: styles.inputBottom }}
        errorText={errorText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  inputTop: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputBottom: {
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
})
