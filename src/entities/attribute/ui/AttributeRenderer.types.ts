import type Ajv from 'ajv'
import type { ReactNode } from 'react'

import type { AttributeSchema } from '../model/types'

export type AttributeRendererProps<TSchema extends AttributeSchema = AttributeSchema> = {
  schema: TSchema
  value: unknown
  ajv: Ajv
  name?: string
  root?: boolean
  renderAttribute: (props: AttributeRendererProps) => ReactNode
}
