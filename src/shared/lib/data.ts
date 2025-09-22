import Aes from 'react-native-aes-crypto'

const generateKey = (password: string, salt: string, cost: number, length: number) =>
  Aes.pbkdf2(password, salt, cost, length, 'sha256')

export const generateUniqueDeviceKeys = async () => {
  const timestamp = Date.now() // Current timestamp
  const randomBytes = await Aes.randomKey(12)

  const rawData = `${timestamp}-${randomBytes}`

  const deviceKey = await generateKey(rawData, 'test', 12, 12)

  return deviceKey
}

export const generateEncryptionKey = async () => {
  const timestamp = Date.now() // Current timestamp

  const randomBytes = await Aes.randomKey(12)

  const rawData = `${timestamp}-${randomBytes}`
  const encryptionKey = await generateKey(rawData, 'test', 12, 12)

  return encryptionKey
}

export const generateUserIdentifier = async () => {
  const timestamp = Date.now() // Current timestamp
  // const randomNumber = Math.floor(Math.random() * 1000000).toString()
  const randomBytes = await Aes.randomKey(12)
  const rawData = `${timestamp}-${randomBytes}`

  const userIdentifier = await generateKey(rawData, 'test', 12, 12)

  return userIdentifier
}

export const createSelfInMee = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Self')
    }, 1000)
  })
}
