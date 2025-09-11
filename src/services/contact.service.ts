import { generateUserIdentifier } from "@utils/data"
import { Platform } from "react-native"
import { Contact as NativeContact } from "react-native-contacts/type"
import { CONTACTS_STORAGE_KEY } from "../constants/contacts"
import { getObjectItem, setObjectItem } from "../store/storage"
import { Connection } from "./core.service"
import "./mockData/contacts"

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

  async rewriteContactsByPlatform(newContacts: NativeContact[], platform: "ios" | "android") {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(CONTACTS_STORAGE_KEY)

    const newContactsByPlatform = await Promise.all(
      newContacts.map((nativeCon) =>
        this.transformNativeContactToConnection(
          nativeCon,
          currentContacts?.[platform]?.find(
            (currentCon) => currentCon.contactInfo?.recordID === nativeCon.recordID,
          ),
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

  async transformNativeContactToConnection(
    nativeContact: NativeContact,
    alreadyCreatedConnection?: Connection,
  ) {
    let newIdentifier
    if (!alreadyCreatedConnection?.id) {
      newIdentifier = await generateUserIdentifier()
    }

    return {
      id: alreadyCreatedConnection?.id ?? newIdentifier,
      name: nativeContact.displayName || `${nativeContact.familyName} ${nativeContact.givenName}`,
      sharedInfo: {
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
        addresses: nativeContact.postalAddresses,
      },
      tags: alreadyCreatedConnection?.tags ?? [],
      iconSrc: nativeContact.thumbnailPath,
      profile: alreadyCreatedConnection?.profile,
      contactInfo: {
        recordID: nativeContact.recordID,
        platform: Platform.OS === "android" || Platform.OS === "ios" ? Platform.OS : undefined,
      },
    }
  }

  updateContact(newContact: Connection, platform: "android" | "ios") {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(CONTACTS_STORAGE_KEY)

    const updContacts = {
      ...currentContacts,
      [platform]: currentContacts?.[platform]?.map((con) =>
        con.id === newContact.id ? newContact : con,
      ),
    }

    setObjectItem(CONTACTS_STORAGE_KEY, updContacts)

    return updContacts
  }

  deleteContact(id: string, platform: "android" | "ios") {
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
