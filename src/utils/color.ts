export const hexAlphaColor = (hex: string, opacityPercent: number) => {
  const decimal = `0${Math.round(255 * (opacityPercent / 100)).toString(16)}`
    .slice(-2)
    .toUpperCase()
  return hex + decimal
}

const getHashOfString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 9) - hash)
  }
  hash = Math.abs(hash)
  return hash
}

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min)
}

export const generateColorHsl = (
  str: string,
  saturationRange: [number, number] = [60, 90],
  lightnessRange: [number, number] = [60, 90],
) => {
  const hash = getHashOfString(str)
  const h = normalizeHash(hash, 0, 360)
  const s = normalizeHash(hash, saturationRange[0], saturationRange[1])
  const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1])

  return `hsl(${h}, ${s}%, ${l}%)`
}
