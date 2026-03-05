import { type ComponentType, type FC, useCallback } from 'react'
import type { O } from 'ts-toolbelt'

import { resolveSchema } from '../lib/resolve-schema'
import type { AttributeSchema } from '../model/types'
import type { AttributeRendererProps } from './AttributeRenderer.types'
import { ObjectAttributeControl } from './ObjectAttributeControl'
import { StringAttributeControl } from './StringAttributeControl'

type AttributeRendererComponent<TSchema extends AttributeSchema = AttributeSchema> = ComponentType<
  AttributeRendererProps<TSchema>
>

type RenderAttributeByType = {
  object: AttributeRendererComponent<AttributeSchema>
  string: AttributeRendererComponent<AttributeSchema>
}

const defaultRenderAttributeByType: RenderAttributeByType = {
  object: ObjectAttributeControl,
  string: StringAttributeControl,
}

/* -------------------------------------------------------------------------------------------------
 * ObjectAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type AnyAttributeRendererProps = O.Omit<AttributeRendererProps, 'renderAttribute'> & {
  renderAttributeByType?: Partial<RenderAttributeByType>
}

const AnyAttributeRenderer: FC<AnyAttributeRendererProps> = (props) => {
  const renderAttribute = useCallback(
    (renderProps: AttributeRendererProps) => {
      const resolvedSchema = resolveSchema(renderProps.schema, props.ajv)

      switch (resolvedSchema?.type) {
        case 'object': {
          const Component = props.renderAttributeByType?.object ?? defaultRenderAttributeByType.object
          return (
            <Component
              {...renderProps}
              renderAttribute={renderAttribute}
              root={renderProps.root ?? true}
              schema={resolvedSchema}
            />
          )
        }

        case 'string': {
          const Component = props.renderAttributeByType?.string ?? defaultRenderAttributeByType.string
          return (
            <Component
              {...renderProps}
              renderAttribute={renderAttribute}
              root={renderProps.root ?? true}
              schema={resolvedSchema}
            />
          )
        }

        default:
          console.error(`Unknown schema type: ${renderProps.schema.type}`)
          return null
      }
    },
    [props],
  )

  return renderAttribute({ ...props, renderAttribute })
}

/* -----------------------------------------------------------------------------------------------*/

export { AnyAttributeRenderer }

export type { AnyAttributeRendererProps }
