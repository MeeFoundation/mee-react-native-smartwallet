export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export const filterNullable = <T>(items: T[]) => {
  return items.filter((x): x is Exclude<T, null | undefined> => x !== undefined && x !== null)
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
