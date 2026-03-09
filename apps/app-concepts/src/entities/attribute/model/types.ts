import type { ReactNode } from 'react'

export type StringAttributeSchema = {
  type: 'string'
  format?: 'email' | 'phone'
}

export type ObjectAttributeSchema = {
  type: 'object'
  properties: Record<string, AttributeSchema>
  required?: string[]
}

export type AttributeSchema = StringAttributeSchema | ObjectAttributeSchema

export type InferAttributeValue<TSchema extends AttributeSchema> =
  TSchema extends StringAttributeSchema
    ? string
    : TSchema extends ObjectAttributeSchema
      ? { [K in keyof TSchema['properties']]?: InferAttributeValue<TSchema['properties'][K]> }
      : never

export type ControlProps<TSchema extends AttributeSchema> = {
  schema: TSchema
  value: InferAttributeValue<TSchema>
  path: string[]
  renderProperty?: (key: string) => ReactNode
}

export type AttributeRendererProps<TSchema extends AttributeSchema> = {
  schema: TSchema
  value: InferAttributeValue<TSchema>
}
