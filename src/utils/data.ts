import Aes from "react-native-aes-crypto"

const generateKey = (password: string, salt: string, cost: number, length: number) =>
  Aes.pbkdf2(password, salt, cost, length, "sha256")

export const generateUniqueDeviceKeys = async () => {
  return new Promise((resolve) => {
    const timestamp = Date.now() // Current timestamp
    const randomBytes = Aes.randomKey(12)

    const rawData = `${timestamp}-${randomBytes}`

    const deviceKey = generateKey(rawData, "test", 12, 12)

    setTimeout(() => {
      resolve(deviceKey)
    }, 1000)
  })
}

export const generateEncryptionKey = async () => {
  return new Promise((resolve) => {
    const timestamp = Date.now() // Current timestamp

    const randomBytes = Aes.randomKey(12)

    const rawData = `${timestamp}-${randomBytes}`
    const encryptionKey = generateKey(rawData, "test", 12, 12)
    setTimeout(() => {
      resolve(encryptionKey)
    }, 1000)
  })
}

export const generateUserIdentifier = async () => {
  return new Promise((resolve) => {
    const timestamp = Date.now() // Current timestamp
    const randomNumber = Math.floor(Math.random() * 1000000).toString()
    const randomBytes = Aes.randomKey(12)

    const rawData = `${timestamp}-${randomBytes}`

    const userIdentifier = generateKey(rawData, "test", 12, 12)
    setTimeout(() => {
      resolve(userIdentifier)
    }, 1000)
  })
}

export const createSelfInMee = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Self")
    }, 1000)
  })
}
