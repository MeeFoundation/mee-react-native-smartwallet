import { Platform } from 'react-native'
import type { Contact as NativeContact } from 'react-native-contacts'

import type { Connection } from '@/entities/connection/@x/contact'

import { CONTACTS_STORAGE_KEY } from '@/shared/config'
import { generateUserIdentifier } from '@/shared/lib/data'
import { getObjectItem, setObjectItem } from '@/shared/model'

import './mock/contacts'

export interface ContactsState {
  ios?: Connection[]
  android?: Connection[]
}

class ContactService {
  async getContacts() {
    const contacts = getObjectItem<ContactsState>(CONTACTS_STORAGE_KEY)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return contacts
  }

  async rewriteContactsByPlatform(newContacts: NativeContact[], platform: 'ios' | 'android') {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(CONTACTS_STORAGE_KEY)

    const newContactsByPlatform = await Promise.all(
      newContacts.map((nativeCon) =>
        this.transformNativeContactToConnection(
          nativeCon,
          currentContacts?.[platform]?.find((currentCon) => currentCon.contactInfo?.recordID === nativeCon.recordID),
        ),
      ),
    )

    const updContacts = {
      ...currentContacts,
      [platform]: newContactsByPlatform,
    }

    setObjectItem(CONTACTS_STORAGE_KEY, updContacts)
    return updContacts
  }

  async transformNativeContactToConnection(nativeContact: NativeContact, alreadyCreatedConnection?: Connection) {
    let newIdentifier: string | undefined
    if (!alreadyCreatedConnection?.id) {
      newIdentifier = await generateUserIdentifier()
    }

    return {
      contactInfo: {
        platform: Platform.OS === 'android' || Platform.OS === 'ios' ? Platform.OS : undefined,
        recordID: nativeContact.recordID,
      },
      iconSrc: nativeContact.thumbnailPath,
      id: alreadyCreatedConnection?.id ?? newIdentifier,
      name: nativeContact.displayName || `${nativeContact.familyName} ${nativeContact.givenName}`,
      profile: alreadyCreatedConnection?.profile,
      sharedInfo: {
        addresses: nativeContact.postalAddresses,
        emails: nativeContact.emailAddresses.map((address) => ({
          key: address.label,
          value: address.email,
        })),
        firstName: nativeContact.givenName,
        lastName: nativeContact.familyName,
        phones: nativeContact.phoneNumbers.map((num) => ({
          key: num.label,
          value: num.number,
        })),
      },
      tags: alreadyCreatedConnection?.tags ?? [],
    }
  }

  updateContact(newContact: Connection, platform: 'android' | 'ios') {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(CONTACTS_STORAGE_KEY)

    const updContacts = {
      ...currentContacts,
      [platform]: currentContacts?.[platform]?.map((con) => (con.id === newContact.id ? newContact : con)),
    }

    setObjectItem(CONTACTS_STORAGE_KEY, updContacts)

    return updContacts
  }

  deleteContact(id: string, platform: 'android' | 'ios') {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(CONTACTS_STORAGE_KEY)

    const updContacts = {
      ...currentContacts,
      [platform]: currentContacts?.[platform]?.filter((con) => con.id !== id),
    }

    setObjectItem(CONTACTS_STORAGE_KEY, updContacts)

    return Promise.resolve(updContacts)
  }
}

export const contactService = new ContactService()
