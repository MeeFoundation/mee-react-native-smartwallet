import { get } from 'lodash-es'
import { type FC, Fragment } from 'react'
import { Text, View } from 'react-native'

import { Separator } from '@/shared/ui/Separator'

import type { AttributeRendererProps } from './AttributeRenderer.types'

/* -------------------------------------------------------------------------------------------------
 * ObjectAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type ObjectAttributeControlProps = AttributeRendererProps

const ObjectAttributeControl: FC<ObjectAttributeControlProps> = (props) => {
  return (
    <View className={props.root ? '' : 'border border-red-500'}>
      {!props.root && <Text>Name: {props.name}</Text>}
      <View>
        {Object.keys(props.schema.properties ?? {}).map((property) => (
          <Fragment key={property}>
            {props.renderAttribute({
              ajv: props.ajv,
              name: [props.name, property].filter(Boolean).join('.'),
              renderAttribute: props.renderAttribute,
              root: false,
              schema: props.schema.properties[property],
              value: get(props.value, property),
            })}
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
