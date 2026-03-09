import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { View } from 'react-native'

import type {
  AttributeRendererProps,
  AttributeSchema,
  InferAttributeValue,
  ObjectAttributeSchema,
} from '../model/types'
import { setNestedValue } from '../model/utils'
import { ObjectAttributeControl } from './ObjectAttributeControl'
import { StringAttributeControl } from './StringAttributeControl'

type HandleError = (path: string[], error: string | undefined) => void
type HandleChange = (path: string[], value: string) => void

function renderNode(
  schema: AttributeSchema,
  value: unknown,
  path: string[],
  errors: Record<string, string>,
  onError: HandleError,
  onChange: HandleChange,
): ReactNode {
  switch (schema.type) {
    case 'string': {
      const key = path.join('.')
      return (
        <View>
          <StringAttributeControl
            error={errors[key]}
            onChange={(v) => onChange(path, v)}
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
          onChange,
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
  const [values, setValues] = useState<InferAttributeValue<TSchema>>(props.value)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = useCallback<HandleChange>(
    (path, value) => {
      setValues((prev) => {
        const next = setNestedValue(prev as Record<string, unknown>, path, value) as InferAttributeValue<TSchema>
        props.onChange?.(next)
        return next
      })
    },
    [props.onChange],
  )

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

  useEffect(() => {
    props.onErrors?.(errors)
  }, [errors, props.onErrors])

  return renderNode(props.schema, values, [], errors, handleError, handleChange)
}
