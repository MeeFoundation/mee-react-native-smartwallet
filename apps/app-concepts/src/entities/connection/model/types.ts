import type { ImageRequireSource } from 'react-native'

export type BasicInfo = {
  email?: string
  firstName: string
  lastName: string
  phone?: string
  emails?: { key: string; value: string }[]
  phones?: { key: string; value: string }[]
  addresses?: Record<string, string>[]
  passwords?: { key: string; value: string }[]
  paymentDetails?: unknown[]
}

export type SharedInfo = BasicInfo

export type Connection = {
  id: string
  name: string
  sharedInfo: SharedInfo
  tags: string[]
  iconSrc?: ImageRequireSource | string
  profile?: string
  status: 'active' | 'archived'

  contactInfo?: {
    recordID: string
    platform?: 'ios' | 'android'
  }
}
