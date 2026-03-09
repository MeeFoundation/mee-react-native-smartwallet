import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { isValidPhoneNumber } from 'libphonenumber-js/min'
import { type FC, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { KeyboardTypeOptions } from 'react-native'
import { Text, View } from 'react-native'

import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, StringAttributeSchema } from '../model/types'

const ajv = new Ajv()
addFormats(ajv)
ajv.addFormat('phone', { type: 'string', validate: (value) => isValidPhoneNumber(value) })

const DEBOUNCE_MS = 500

/* -------------------------------------------------------------------------------------------------
 * StringAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type StringAttributeControlProps = ControlProps<StringAttributeSchema>

const FORMAT_KEYBOARD_TYPE: Record<NonNullable<StringAttributeSchema['format']>, KeyboardTypeOptions> = {
  email: 'email-address',
  phone: 'phone-pad',
}

const StringAttributeControl: FC<StringAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const [value, setValue] = useState(props.value ?? '')
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const keyPath = `attribute_${props.path.join('.')}`
  const name = props.path.at(-1) ?? ''
  const label = t(`${keyPath}.label`, { defaultValue: name })
  const placeholder = t(`${keyPath}.placeholder`, { defaultValue: '' })
  const keyboardType = props.schema.format ? FORMAT_KEYBOARD_TYPE[props.schema.format] : 'default'

  const handleChangeText = useCallback(
    (text: string) => {
      setValue(text)
      props.onChange?.(text)
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        if (!text) {
          props.onError?.(undefined)
          return
        }
        const valid = ajv.validate(props.schema, text)
        if (valid) {
          props.onError?.(undefined)
        } else {
          const msg = t(`${keyPath}.error`, { defaultValue: 'Invalid value' })
          props.onError?.(msg)
        }
      }, DEBOUNCE_MS)
    },
    [keyPath, props.onChange, props.onError, props.schema, t],
  )

  return (
    <View className="mt-4">
      <TextInput.Root empty={!value && !placeholder} invalid={!!props.error} size="sm">
        <TextInput.Label>{label}</TextInput.Label>
        <TextInput.Input
          keyboardType={keyboardType}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          value={value}
        />
      </TextInput.Root>
      {props.error && <Text className="mt-1 ml-1 text-danger text-xs">{props.error}</Text>}
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { StringAttributeControl }

export type { StringAttributeControlProps }
