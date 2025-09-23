import { merge } from 'lodash-es'
import { define, type Struct, validate as structValidate } from 'superstruct'

export const requiredStringMoreThanStruct = (length: number) =>
  define<string>('RequiredString', (value) => {
    return typeof value === 'string' && value.length > length
      ? true
      : {
          message: `Required. ${length + 1} characters minimum.`,
        }
  })

export const emailStruct = define<string>('email', (value) =>
  typeof value === 'string' && value.match(/^[\w-.+]{3,}@([\w-]+\.)+[\w-]{2,4}$/)
    ? true
    : {
        message: 'Invalid email.',
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
    const errors = err.failures()
    const createErrorsPath = (obj: Record<string, unknown>, path: string[], lastValue: string) => {
      let currentIndex = 0

      const addPathByKey = (lastObj: Record<string, unknown>) => {
        const pathKeyObj = {}
        lastObj[path[currentIndex]] = currentIndex === path.length - 1 ? lastValue : pathKeyObj
        currentIndex++
        if (currentIndex !== path.length) {
          addPathByKey(pathKeyObj)
        }
      }

      addPathByKey(obj)

      return obj
    }
    const errorsMap = errors.reduce(
      (acc, error) => {
        // FIXME add type validation
        const newErrorMapping = createErrorsPath({}, error.path as string[], error.message)
        return merge(acc, newErrorMapping)
      },
      {} as Record<string, unknown>,
    )

    console.error('Validation failed with errors: ', errors)
    return { errors: errorsMap, valid: false as const }
  }

  return { result, valid: true as const }
}
