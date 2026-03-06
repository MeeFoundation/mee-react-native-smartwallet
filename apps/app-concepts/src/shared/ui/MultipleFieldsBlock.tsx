import type { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { TextField, type TextFieldProps } from './TextField'

export type MultipleFieldsBlockProps = {
  valuesConfig: {
    value: string | undefined
    label: string
    onChange: (value: string) => void
    errorText?: string
    placeholder?: string
  }[]
} & Pick<TextFieldProps, 'RightIconActive' | 'style' | 'disabled'>

export const MultipleFieldsBlock: FC<MultipleFieldsBlockProps> = ({
  valuesConfig,
  style,
  disabled,
  RightIconActive,
}) => {
  return (
    <View style={[styles.container, style]}>
      {valuesConfig.map((valueConfig, index) => (
        <TextField
          disabled={disabled}
          errorText={valueConfig.errorText}
          isLabelInside
          key={valueConfig.label}
          label={valueConfig.label}
          onChangeText={valueConfig.onChange}
          placeholder={valueConfig.placeholder}
          propsStyles={{
            input: StyleSheet.flatten([
              index === 0 && styles.inputTop,
              index === valuesConfig.length - 1 && styles.inputBottom,
              index !== 0 && index !== valuesConfig.length - 1 && styles.inputIntermediate,
            ]),
          }}
          RightIconActive={RightIconActive}
          value={valueConfig.value}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  inputBottom: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  inputIntermediate: {
    borderRadius: 0,
    borderTopWidth: 0,
  },
  inputTop: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
})
