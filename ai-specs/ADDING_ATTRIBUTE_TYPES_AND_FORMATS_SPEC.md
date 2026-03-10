# Adding New Attribute Types and Formats

This spec describes exactly how to extend the attribute rendering system.
It reflects the **current implementation** — always verify file contents before making changes.

---

## Architecture Overview

```
model/types.ts          — AttributeSchema union, InferAttributeValue, ControlProps
model/utils.ts          — setNestedValue helper
ui/AttributesRenderer   — renderNode switch + values/errors state
ui/StringAttributeControl — string type: AJV validation, keyboard type, i18n
ui/ObjectAttributeControl — object type: bordered group or flat root
```

`AttributeRenderer` owns `values` and `errors` state. Controls are **fully controlled** — they receive `value` from props and call `onChange` on every keystroke. Validation is debounced (500ms) and reported via `onError` callback. Errors are stored in `AttributeRenderer` as a flat `Record<string, string>` keyed by dot-path (e.g. `"address.address_street"`).

---

## Part 1 — Adding a New Attribute TYPE

A "type" is a new top-level schema variant (e.g. `number`, `boolean`, `date`).
Requires **5 changes**.

### Step 1 — `model/types.ts`: add schema type, extend union and inference

```ts
// 1a. New schema type
export type NumberAttributeSchema = {
  type: 'number'
  minimum?: number
  maximum?: number
}

// 1b. Extend the union
export type AttributeSchema = StringAttributeSchema | ObjectAttributeSchema | NumberAttributeSchema

// 1c. Extend InferAttributeValue
export type InferAttributeValue<TSchema extends AttributeSchema> =
  TSchema extends StringAttributeSchema
    ? string
    : TSchema extends NumberAttributeSchema
      ? number
      : TSchema extends ObjectAttributeSchema
        ? { [K in keyof TSchema['properties']]?: InferAttributeValue<TSchema['properties'][K]> }
        : never
```

> `ObjectAttributeSchema` branch must stay last in `InferAttributeValue` — it is the widest match.

### Step 2 — Create a control component

Create `entities/attribute/ui/NumberAttributeControl.tsx`.

Requirements:
- Props type: `ControlProps<NumberAttributeSchema> & { onChange: (value: string) => void }`
  (override `onChange` as required — same pattern as `StringAttributeControl`)
- Call `props.onChange(text)` immediately on every input change (fully controlled, no local value state)
- Debounce AJV validation with `useRef<ReturnType<typeof setTimeout>>(undefined)`
- Call `props.onError?.(msg)` on validation failure, `props.onError?.(undefined)` on success or empty
- Use `props.path.at(-1) ?? ''` as the fallback label name
- Use i18n key `attribute_${props.path.join('.')}.label` for label, `.error` for validation error message
- Display `props.error` as a red text below the input (same as `StringAttributeControl`)
- Use `TextInput.Root` with `size="sm"`, `empty={!value && !placeholder}`, `invalid={!!props.error}`

AJV instance: create a **module-level** `const ajv = new Ajv()` inside the new file. Do NOT share
the AJV instance from `StringAttributeControl`.

### Step 3 — `ui/AttributesRenderer.tsx`: add case to `renderNode`

```ts
case 'number': {
  const key = path.join('.')
  return (
    <View>
      <NumberAttributeControl
        error={errors[key]}
        onChange={(v) => onChange(path, v)}
        onError={(e) => onError(path, e)}
        path={path}
        schema={schema}
        value={value as number}
      />
    </View>
  )
}
```

Import `NumberAttributeControl` at the top of the file.

> Note: `onChange` in `renderNode` signature is `HandleChange = (path: string[], value: string) => void`.
> The control always reports string values up — `AttributeRenderer` stores everything as `unknown` in its
> `values` state via `setNestedValue`. Type conversion (string → number) happens in the control before
> calling `props.onChange` if needed, or at the consumer level.

### Step 4 — Add i18n translations

For every field using the new type, add translations to both locale files:

```
apps/app-concepts/src/features/localization/config/resources/common.en.json
apps/app-concepts/src/features/localization/config/resources/common.es.json
```

Key structure:
```json
"attribute_<field_name>": {
  "label": "Age",
  "error": "Invalid number"
}
```

### Step 5 — Use in a schema const

```ts
export const mySchema = {
  type: 'object',
  properties: {
    age: { type: 'number', minimum: 0, maximum: 120 },
  },
} satisfies ObjectAttributeSchema
```

TypeScript infers `{ age?: number }` as the value type automatically.

---

## Part 2 — Adding a New String FORMAT

A "format" is a specialization of `StringAttributeSchema` (e.g. `url`, `date`).
Requires **4 changes**. No new component — `StringAttributeControl` handles all string formats.

### Step 1 — `model/types.ts`: extend the format union

```ts
export type StringAttributeSchema = {
  type: 'string'
  format?: 'email' | 'phone' | 'url'   // ← add here
}
```

### Step 2 — `ui/StringAttributeControl.tsx`: register AJV format and keyboard type

```ts
// Add AJV format validator (module level, after addFormats(ajv))
ajv.addFormat('url', {
  type: 'string',
  validate: (value) => {
    try { new URL(value); return true } catch { return false }
  },
})

// Add keyboard type mapping
const FORMAT_KEYBOARD_TYPE: Record<NonNullable<StringAttributeSchema['format']>, KeyboardTypeOptions> = {
  email: 'email-address',
  phone: 'phone-pad',
  url: 'url',               // ← add here
}
```

> `FORMAT_KEYBOARD_TYPE` is typed as `Record<NonNullable<StringAttributeSchema['format']>, KeyboardTypeOptions>`.
> TypeScript will error if you add a format to the union but forget to add it here — this is intentional.

Built-in `ajv-formats` formats (like `email`, `uri`, `date`, `date-time`, `ipv4`, etc.) are already
registered via `addFormats(ajv)` and do NOT need a manual `ajv.addFormat` call.
Only formats NOT in `ajv-formats` (like `phone`) need a custom validator.

Check the `ajv-formats` package for the full list of built-in formats:
`node_modules/ajv-formats/src/formats.ts`

### Step 3 — Add i18n translations

Add entries to both locale files for each field that uses the new format:

```json
"attribute_<field_name>": {
  "label": "Website",
  "placeholder": "https://example.com",
  "error": "Invalid URL"
}
```

Keys used by `StringAttributeControl`:
- `.label` — shown as the floating label (falls back to field name)
- `.placeholder` — shown inside the input when empty (falls back to `''`)
- `.error` — shown in red below the field on validation failure (falls back to `'Invalid value'`)

### Step 4 — Use in a schema const

```ts
export const mySchema = {
  type: 'object',
  properties: {
    website: { type: 'string', format: 'url' },
  },
} satisfies ObjectAttributeSchema
```

---

## Checklist

### New type checklist
- [ ] `model/types.ts`: new `*AttributeSchema` type defined
- [ ] `model/types.ts`: added to `AttributeSchema` union
- [ ] `model/types.ts`: added to `InferAttributeValue` (before `ObjectAttributeSchema` branch)
- [ ] New `*AttributeControl.tsx` created with `onChange` required, fully controlled, debounced AJV
- [ ] `AttributesRenderer.tsx` `renderNode`: new `case` added, control imported
- [ ] i18n: `.label` and `.error` keys added to both `common.en.json` and `common.es.json`

### New format checklist
- [ ] `model/types.ts`: format string added to `StringAttributeSchema['format']` union
- [ ] `StringAttributeControl.tsx`: `FORMAT_KEYBOARD_TYPE` entry added (TS enforces this)
- [ ] `StringAttributeControl.tsx`: `ajv.addFormat(...)` added if not a built-in `ajv-formats` format
- [ ] i18n: `.label`, `.placeholder` (optional), `.error` keys added to both locale files

### After any change
- [ ] `pnpm check-types` — no TypeScript errors
- [ ] `pnpm lint` — no Biome errors
- [ ] `pnpm steiger:concepts` — no FSD violations
