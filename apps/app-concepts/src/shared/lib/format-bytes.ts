export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return [parseFloat((bytes / k ** i).toFixed(decimals)), sizes[i]].join('')
}
