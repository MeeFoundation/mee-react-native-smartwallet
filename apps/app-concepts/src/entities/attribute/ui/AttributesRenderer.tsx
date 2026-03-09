import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { View } from 'react-native'

import type {
  AttributeRendererProps,
  AttributeSchema,
  InferAttributeValue,
  ObjectAttributeSchema,
} from '../model/types'
import { ObjectAttributeControl } from './ObjectAttributeControl'
import { StringAttributeControl } from './StringAttributeControl'

type HandleError = (path: string[], error: string | undefined) => void

function renderNode(
  schema: AttributeSchema,
  value: unknown,
  path: string[],
  errors: Record<string, string>,
  onError: HandleError,
): ReactNode {
  switch (schema.type) {
    case 'string': {
      const key = path.join('.')
      const error = errors[key]
      return (
        <View>
          <StringAttributeControl
            error={error}
            onError={(e) => onError(path, e)}
            path={path}
            schema={schema}
            value={value as string}
          />
        </View>
      )
    }
    case 'object': {
      const renderProperty = (key: string) =>
        renderNode(
          schema.properties[key],
          (value as Record<string, unknown>)?.[key],
          [...path, key],
          errors,
          onError,
        )
      return (
        <ObjectAttributeControl
          path={path}
          renderProperty={renderProperty}
          schema={schema}
          value={value as InferAttributeValue<ObjectAttributeSchema>}
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleError = useCallback<HandleError>((path, error) => {
    const key = path.join('.')
    setErrors((prev) => {
      if (!error) {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: error }
    })
  }, [])

  return renderNode(props.schema, props.value, [], errors, handleError)
}
