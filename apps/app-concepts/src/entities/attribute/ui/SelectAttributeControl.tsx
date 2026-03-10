import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

import CircleCheckIcon from '@/assets/images/circle-check.svg'

import * as TextInput from '@/shared/ui/TextInput'

import type { ControlProps, SelectAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * SelectAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type SelectAttributeControlProps = ControlProps<SelectAttributeSchema> & {
  onChange: (value: string) => void
}

const SelectAttributeControl: FC<SelectAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const [showPicker, setShowPicker] = useState(false)

  const keyPath = `attribute_${props.path.join('.')}`
  const name = props.path.at(-1) ?? ''
  const label = t(`${keyPath}.label`, { defaultValue: name })
  const displayValue = props.value
    ? t(`${keyPath}.options.${props.value}`, { defaultValue: props.value })
    : ''

  return (
    <View className="mt-4">
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput.Root empty={!props.value} invalid={!!props.error} size="sm">
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
            const isSelected = props.value === option
            const optionLabel = t(`${keyPath}.options.${option}`, { defaultValue: option })
            return (
              <Pressable
                key={option}
                className={`flex-row items-center justify-between border-black/7 border-b px-4 py-3 ${isSelected ? 'bg-gray-50' : 'bg-white'}`}
                onPress={() => {
                  props.onChange(option)
                  setShowPicker(false)
                }}
              >
                <Text className="text-base text-gray-900">{optionLabel}</Text>
                {isSelected && <CircleCheckIcon height={20} width={20} />}
              </Pressable>
            )
          })}
        </View>
      </Modal>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { SelectAttributeControl }

export type { SelectAttributeControlProps }
