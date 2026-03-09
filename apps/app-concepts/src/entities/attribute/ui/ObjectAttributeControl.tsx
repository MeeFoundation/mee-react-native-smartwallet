import { type FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Separator } from '@/shared/ui/Separator'

import type { ControlProps, ObjectAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * ObjectAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type ObjectAttributeControlProps = ControlProps<ObjectAttributeSchema>

const ObjectAttributeControl: FC<ObjectAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const isRoot = props.path.length === 0
  const label = isRoot ? '' : t(`attribute_${props.path.join('.')}.label`, { defaultValue: props.path.at(-1) ?? '' })

  return (
    <View className={isRoot ? '' : 'border border-red-500'}>
      {!isRoot && <Text>{label}</Text>}
      <View>
        {Object.keys(props.schema.properties ?? {}).map((key) => (
          <Fragment key={key}>
            {props.renderProperty?.(key)}
            <Separator />
          </Fragment>
        ))}
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ObjectAttributeControl }

export type { ObjectAttributeControlProps }
