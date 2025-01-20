import { generateHash } from "react-native-bcrypt-cpp"

export const generateUniqueDeviceKeys = async () => {
  return new Promise((resolve) => {
    const timestamp = Date.now() // Current timestamp
    const randomBytes = generateHash("16", 12)

    const rawData = `${timestamp}-${randomBytes}`

    const deviceKey = generateHash(rawData, 12)

    setTimeout(() => {
      resolve(deviceKey)
    }, 1000)
  })
}

export const generateEncryptionKey = async () => {
  return new Promise((resolve) => {
    const timestamp = Date.now() // Current timestamp
    const randomNumber = Math.floor(Math.random() * 1000000).toString()
    const randomBytes = generateHash(randomNumber, 12)

    const rawData = `${timestamp}-${randomBytes}`

    const encryptionKey = generateHash(rawData, 12)

    setTimeout(() => {
      resolve(encryptionKey)
    }, 1000)
  })
}

export const generateUserIdentifier = async () => {
  return new Promise((resolve) => {
    const timestamp = Date.now() // Current timestamp
    const randomNumber = Math.floor(Math.random() * 1000000).toString()
    const randomBytes = generateHash(randomNumber, 12)

    const rawData = `${timestamp}-${randomBytes}`

    const userIdentifier = generateHash(rawData, 12)

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
