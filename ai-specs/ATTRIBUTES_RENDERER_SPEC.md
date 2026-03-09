# AttributeRenderer Refactor Spec

## Goals

1. `schema` prop value is strictly typed — a TS discriminated union, no `AnySchemaObject`, no JSON imports
2. No `$ref` pattern — schemas are defined directly as typed TS consts
3. No `ajv` prop — AJV is used internally for validation only, errors surfaced via `console.error`

---

## 1. Strict Schema Types

Replace `type AttributeSchema = AnySchemaObject` with a discriminated union:

```ts
type StringAttributeSchema = {
  type: 'string'
  format?: 'email' | 'phone'
}

type ObjectAttributeSchema = {
  type: 'object'
  properties: Record<string, AttributeSchema>
  required?: string[]
}

type AttributeSchema = StringAttributeSchema | ObjectAttributeSchema
```

> **Extensibility note**: Adding a new schema variant (e.g. `number`, `boolean`) requires changes in
> two places: the `AttributeSchema` union and `InferAttributeValue`. This is intentional
> — the union is closed by design.

Schema values are defined as typed TS `const` objects — no JSON file imports, no `$ref`.
Use `satisfies` so TypeScript validates the shape while preserving the narrow literal type
(required for `InferAttributeValue` to infer exact property keys):

```ts
// Before: JSON import + $ref
"display_name": { "$ref": "http://example.com/schemas/definitions.json#/definitions/display_name" }

// After: typed TS const
export const requestedAttributesSchema = {
  type: 'object',
  properties: {
    display_name: { type: 'string' },
    email:        { type: 'string', format: 'email' },
    first_name:   { type: 'string' },
    last_name:    { type: 'string' },
    status:       { type: 'string' },
    address: {
      type: 'object',
      properties: {
        address_country:     { type: 'string' },
        address_description: { type: 'string' },
        address_locality:    { type: 'string' },
        address_postal_code: { type: 'string' },
        address_region:      { type: 'string' },
        address_street:      { type: 'string' },
      },
    },
  },
  required: ['display_name', 'email'],
} satisfies ObjectAttributeSchema
```

TypeScript now fully understands the shape of `requestedAttributesSchema` and infers
the value type from it (see section 2).

---

## 2. Value Type Inference

A utility type infers the runtime value shape from a schema type:

```ts
type InferAttributeValue<TSchema extends AttributeSchema> =
  TSchema extends StringAttributeSchema
    ? string
    : TSchema extends ObjectAttributeSchema
      ? { [K in keyof TSchema['properties']]?: InferAttributeValue<TSchema['properties'][K]> }
      : never
```

`AttributeRendererProps` uses this so `value` is typed against the schema:

```ts
type AttributeRendererProps<TSchema extends AttributeSchema> = {
  schema: TSchema
  value: InferAttributeValue<TSchema>
}
```

Usage:

```ts
// schema type is inferred from the const → value type is inferred from the schema
<AttributeRenderer schema={requestedAttributesSchema} value={myGroupPersonalDetails} />
```

---

## 3. AJV — Internal Validation with console.error

AJV is no longer a prop or a hook called by the consumer. It is instantiated **once at module
level** and used to validate each node's value against its schema before rendering. Validation
failures are reported via `console.error` — no error UI is rendered.

`useAjv`, `attributeDefinitionsAtom`, `getAttributeDefinitions` API, `definitions.schema.json` mock,
and `resolveSchema` lib are all **deleted** — they only existed to support `$ref` resolution.
Callers have no AJV dependency.

---

## 4. AttributeRenderer

`AttributeRenderer` is a plain component. AJV is instantiated once at module level. Recursion is
handled internally via `renderNode` — `ObjectAttributeControl` receives a `renderProperty` callback
to render its children without driving the recursion itself.

```ts
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
```

---

## 5. Control Props

All types (`AttributeSchema` variants, `InferAttributeValue`, `ControlProps`, `AttributeRendererProps`)
live in `model/types.ts`. The separate `AttributeRenderer.types.ts` file is deleted.

Controls receive only what they need to display/edit. `name` and `root` are not props — they are
derived from `path` by the control when needed:

```ts
type ControlProps<TSchema extends AttributeSchema> = {
  schema: TSchema
  value: InferAttributeValue<TSchema>
  path: string[]    // full path from root (e.g. ["address", "address_country"])
                    // [] at root; path.at(-1) is the leaf name
  // injected into object controls only; used to render child properties recursively
  renderProperty?: (key: string) => ReactNode
}
```

In controls:
- `props.path.at(-1) ?? ''` — leaf field name for labels
- `props.path.length === 0` — whether this is the root node

---

## 6. Group Mock Data — Strict Typed TS Consts

The group entity currently loads `mock-requested-attributes.schema.json` (deleted) via an async
mock API. After the refactor, both the schema and the personal details value are typed TS consts.
The atom and the async mock API wrapper are kept — only their backing data changes from JSON to TS.

### Schema const

```ts
// entities/group/api/mock/mock-requested-attributes-schema.ts  (replaces .schema.json)
import type { ObjectAttributeSchema } from '@/entities/attribute'

export const mockRequestedAttributesSchema = {
  type: 'object',
  properties: {
    display_name: { type: 'string' },
    email:        { type: 'string', format: 'email' },
    first_name:   { type: 'string' },
    last_name:    { type: 'string' },
    status:       { type: 'string' },
    address: {
      type: 'object',
      properties: {
        address_country:     { type: 'string' },
        address_description: { type: 'string' },
        address_locality:    { type: 'string' },
        address_postal_code: { type: 'string' },
        address_region:      { type: 'string' },
        address_street:      { type: 'string' },
      },
    },
  },
  required: ['display_name', 'email'],
} satisfies ObjectAttributeSchema
```

### Personal details mock value

```ts
// entities/group/api/mock/mock-my-group-personal-details.ts
import type { InferAttributeValue } from '@/entities/attribute'
import { mockRequestedAttributesSchema } from './mock-requested-attributes-schema'

export const mockMyGroupPersonalDetails: InferAttributeValue<typeof mockRequestedAttributesSchema> = {
  display_name: 'Jane Doe',
  email: 'jane@example.com',
  first_name: 'Jane',
  last_name: 'Doe',
  status: 'active',
  address: {
    address_country: 'US',
    address_locality: 'New York',
    address_street: '123 Main St',
    address_postal_code: '10001',
    address_region: 'NY',
    address_description: '',
  },
}
```

`InferAttributeValue<typeof mockRequestedAttributesSchema>` is the exact value type — TypeScript
will error if a property name is wrong or a value has the wrong type.

### Updated API function

```ts
// get-group-requested-attributes-schema.ts — return type narrows from AnySchemaObject to ObjectAttributeSchema
import type { ObjectAttributeSchema } from '@/entities/attribute'
import { mockRequestedAttributesSchema } from './mock/mock-requested-attributes-schema'

export const getGroupRequestedAttributesSchema = async (_groupId: string): Promise<ObjectAttributeSchema> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockRequestedAttributesSchema
}
```

The atoms (`getGroupRequestedAttributesSchemaAtom`, `getMyGroupPersonalDetailsAtom`) are kept
unchanged — only their backing mock data and return types tighten.

---

## 7. File Changes Summary

| File | Action |
|---|---|
| `entities/attribute/model/types.ts` | Replace `AnySchemaObject` with `StringAttributeSchema`, `ObjectAttributeSchema`, `AttributeSchema`, `InferAttributeValue<T>`, `ControlProps<T>`, `AttributeRendererProps<T>` |
| `entities/attribute/model/attribute-definitions.atom.ts` | **Delete** |
| `entities/attribute/api/get-attribute-definitions.ts` | **Delete** |
| `entities/attribute/api/mock/definitions.schema.json` | **Delete** |
| `entities/attribute/lib/resolve-schema.ts` | **Delete** |
| `entities/attribute/lib/use-ajv.ts` | **Delete** |
| `entities/attribute/ui/AttributeRenderer.types.ts` | **Delete** — types moved to `model/types.ts` |
| `entities/attribute/ui/AttributesRenderer.tsx` | Rewrite as plain component + `renderNode` (see section 4) |
| `entities/attribute/ui/ObjectAttributeControl.tsx` | Update to new `ControlProps` — use `renderProperty`; derive name/root from `path` |
| `entities/attribute/ui/StringAttributeControl.tsx` | Update to new `ControlProps` — no `ajv`; derive name from `path.at(-1)` |
| `entities/attribute/index.ts` | Remove `useAjv` + `attributeDefinitionsAtom`; export `AttributeRenderer` |
| `entities/group/api/mock/mock-requested-attributes.schema.json` | **Delete** — replaced by `mock-requested-attributes-schema.ts` |
| `entities/group/api/mock/mock-requested-attributes-schema.ts` | **New** — typed TS const (see section 6) |
| `entities/group/api/mock/mock-my-group-personal-details.ts` | **New or update** — typed value const using `InferAttributeValue` |
| `entities/group/api/get-group-requested-attributes-schema.ts` | Narrow return type to `ObjectAttributeSchema`; import TS const |

### Caller changes (`PersonalDetails.tsx`)

```ts
// Before
const ajv = useAjv(requestedAttributesSchema)
<AnyAttributeRenderer ajv={ajv} schema={requestedAttributesSchema} value={myGroupPersonalDetails} />

// After
import { AttributeRenderer } from '@/entities/attribute'

<AttributeRenderer schema={requestedAttributesSchema} value={myGroupPersonalDetails} />
```
