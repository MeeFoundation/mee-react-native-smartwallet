import { Failure, Struct, StructError, define, validate as structValidate } from "superstruct"

export const requiredStringMoreThanStruct = (length: number) =>
  define<string>("RequiredString", (value) => {
    return typeof value === "string" && value.length > length
      ? true
      : {
          message: `Required. ${length + 1} characters minimum.`,
        }
  })

export const emailStruct = define<string>("email", (value) =>
  typeof value === "string" && value.match(/^[\w-.+]{3,}@([\w-]+\.)+[\w-]{2,4}$/)
    ? true
    : {
        message: "Invalid email.",
      },
)

export const customValidate = <T, V, S>(
  value: T,
  struct: Struct<V, S>,
  options?: {
    coerce?: boolean
    mask?: boolean
    message?: string
  },
) => {
  const [err, result] = structValidate(value, struct, options)
  if (err) {
    const errors = (err as StructError).failures() as Failure[]
    const errorsMap = errors.reduce((acc, error) => {
      return { ...acc, [error.key]: error.message }
    }, {} as Record<string, string>)

    console.error("Validation failed with errors: ", errors)
    return { valid: false as const, errors: errorsMap }
  }

  return { valid: true as const, result }
}
