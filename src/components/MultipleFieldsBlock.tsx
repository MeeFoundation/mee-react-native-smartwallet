import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { TextField, TextFieldProps } from "./TextField"

export type MultipleFieldsBlockProps = {
  valuesConfig: {
    value: string | undefined
    label: string
    onChange: (value: string) => void
    errorText?: string
    placeholder?: string
  }[]
} & Pick<TextFieldProps, "RightIconActive" | "style" | "disabled">

export const MultipleFieldsBlock: FC<MultipleFieldsBlockProps> = ({
  valuesConfig,
  style,
  disabled,
  RightIconActive,
}) => {
  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      {valuesConfig.map((valueConfig, index) => (
        <TextField
          key={index}
          value={valueConfig.value}
          label={valueConfig.label}
          isLabelInside
          disabled={disabled}
          onChangeText={valueConfig.onChange}
          placeholder={valueConfig.placeholder}
          propsStyles={{
            input: StyleSheet.flatten([
              index === 0 && styles.inputTop,
              index === valuesConfig.length - 1 && styles.inputBottom,
              index !== 0 && index !== valuesConfig.length - 1 && styles.inputIntermediate,
            ]),
          }}
          errorText={valueConfig.errorText}
          RightIconActive={RightIconActive}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  inputIntermediate: {
    borderRadius: 0,
    borderTopWidth: 0,
  },
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
