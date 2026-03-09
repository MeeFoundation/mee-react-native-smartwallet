export function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: string,
): Record<string, unknown> {
  const [head, ...rest] = path
  if (rest.length === 0) {
    return { ...obj, [head]: value }
  }
  return {
    ...obj,
    [head]: setNestedValue((obj[head] as Record<string, unknown>) ?? {}, rest, value),
  }
}
