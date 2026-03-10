import Ajv from 'ajv'
import { type FC, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, NumberAttributeSchema } from '../model/types'

const ajv = new Ajv()

const DEBOUNCE_MS = 500

/* -------------------------------------------------------------------------------------------------
 * NumberAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type NumberAttributeControlProps = ControlProps<NumberAttributeSchema> & {
  onChange: (value: number) => void
}

const NumberAttributeControl: FC<NumberAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [textValue, setTextValue] = useState(props.value != null ? String(props.value) : '')

  const keyPath = `attribute_${props.path.join('.')}`
  const name = props.path.at(-1) ?? ''
  const label = t(`${keyPath}.label`, { defaultValue: name })
  const placeholder = t(`${keyPath}.placeholder`, { defaultValue: '' })

  const handleChangeText = useCallback(
    (text: string) => {
      setTextValue(text)
      const num = Number(text)
      if (text !== '' && !Number.isNaN(num)) {
        props.onChange(num)
      }
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        if (!text) {
          props.onError?.(undefined)
          return
        }
        const parsed = Number(text)
        if (Number.isNaN(parsed)) {
          props.onError?.(t(`${keyPath}.error`, { defaultValue: 'Invalid number' }))
          return
        }
        const valid = ajv.validate(props.schema, parsed)
        if (valid) {
          props.onError?.(undefined)
        } else {
          props.onError?.(t(`${keyPath}.error`, { defaultValue: 'Invalid number' }))
        }
      }, DEBOUNCE_MS)
    },
    [keyPath, props.onChange, props.onError, props.schema, t],
  )

  return (
    <View className="mt-4">
      <TextInput.Root empty={!textValue && !placeholder} invalid={!!props.error} size="sm">
        <TextInput.Label>{label}</TextInput.Label>
        <TextInput.Input
          keyboardType="numeric"
          onChangeText={handleChangeText}
          placeholder={placeholder}
          value={textValue}
        />
      </TextInput.Root>
      {props.error && <Text className="mt-1 ml-1 text-danger text-xs">{props.error}</Text>}
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { NumberAttributeControl }

export type { NumberAttributeControlProps }
