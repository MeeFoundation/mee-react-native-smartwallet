import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { ReactNode } from 'react'

import type {
  AttributeRendererProps,
  AttributeSchema,
  InferAttributeValue,
  ObjectAttributeSchema,
} from '../model/types'
import { ObjectAttributeControl } from './ObjectAttributeControl'
import { StringAttributeControl } from './StringAttributeControl'

const ajv = new Ajv()
addFormats(ajv)

function renderNode(schema: AttributeSchema, value: unknown, path: string[]): ReactNode {
  const isValid = ajv.validate(schema, value)
  if (!isValid) {
    console.error(`[AttributeRenderer] Validation failed for "${path.join('.')}":`, ajv.errors)
  }

  switch (schema.type) {
    case 'string':
      return <StringAttributeControl schema={schema} value={value as string} path={path} />
    case 'object': {
      const renderProperty = (key: string) =>
        renderNode(
          schema.properties[key],
          (value as Record<string, unknown>)?.[key],
          [...path, key],
        )
      return (
        <ObjectAttributeControl
          schema={schema}
          value={value as InferAttributeValue<ObjectAttributeSchema>}
          path={path}
          renderProperty={renderProperty}
        />
      )
    }
    default:
      console.error(`[AttributeRenderer] Unknown schema type: ${(schema as AttributeSchema).type}`)
      return null
  }
}

export function AttributeRenderer<TSchema extends AttributeSchema>(
  props: AttributeRendererProps<TSchema>,
): ReactNode {
  return renderNode(props.schema, props.value, [])
}
