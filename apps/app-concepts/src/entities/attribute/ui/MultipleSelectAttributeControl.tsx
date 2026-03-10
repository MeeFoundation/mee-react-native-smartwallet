import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

import CheckIcon from '@/assets/images/check.svg'

import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, MultipleSelectAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * MultipleSelectAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type MultipleSelectAttributeControlProps = ControlProps<MultipleSelectAttributeSchema> & {
  onChange: (value: string[]) => void
}

const MultipleSelectAttributeControl: FC<MultipleSelectAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const [showPicker, setShowPicker] = useState(false)

  const selected = props.value ?? []
  const keyPath = `attribute_${props.path.join('.')}`
  const name = props.path.at(-1) ?? ''
  const label = t(`${keyPath}.label`, { defaultValue: name })
  const translateOption = (option: string) => t(`${keyPath}.options.${option}`, { defaultValue: option })
  const displayValue = selected.map(translateOption).join(', ')

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      props.onChange(selected.filter((v) => v !== option))
    } else {
      props.onChange([...selected, option])
    }
  }

  return (
    <View className="mt-4">
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput.Root empty={selected.length === 0} invalid={!!props.error} size="sm">
          <TextInput.Label>{label}</TextInput.Label>
          <TextInput.Input editable={false} pointerEvents="none" value={displayValue} />
        </TextInput.Root>
      </TouchableOpacity>
      {props.error && <Text className="mt-1 ml-1 text-danger text-xs">{props.error}</Text>}

      <Modal animationType="slide" transparent visible={showPicker}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setShowPicker(false)} />
        <View className="bg-white pb-6">
          <View className="flex-row justify-end px-4 pt-2">
            <Pressable onPress={() => setShowPicker(false)}>
              <Text className="font-medium text-base text-primary">
                {t('common.done', { defaultValue: 'Done' })}
              </Text>
            </Pressable>
          </View>
          {props.schema.options.map((option) => {
            const isSelected = selected.includes(option)
            const optionLabel = translateOption(option)
            return (
              <Pressable
                key={option}
                className={`flex-row items-center justify-between border-black/7 border-b px-4 py-3 ${isSelected ? 'bg-gray-50' : 'bg-white'}`}
                onPress={() => toggle(option)}
              >
                <Text className="text-base text-gray-900">{optionLabel}</Text>
                <View
                  className={`h-5 w-5 items-center justify-center rounded ${isSelected ? 'bg-primary' : 'border border-gray-300'}`}
                >
                  {isSelected && <CheckIcon color="white" height={14} width={14} />}
                </View>
              </Pressable>
            )
          })}
        </View>
      </Modal>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { MultipleSelectAttributeControl }

export type { MultipleSelectAttributeControlProps }
