import { Platform } from "react-native"
import { Contact as NativeContact } from "react-native-contacts/type"
import { getObjectItem, setObjectItem } from "../store/storage"
import { generateUserIdentifier } from "../utils/data"
import { Connection } from "./core.service"

export const STORAGE_KEY = "contacts_storage_key"

export interface ContactsState {
  ios?: Connection[]
  android?: Connection[]
}
class ContactService {
  async getContacts() {
    const contacts = getObjectItem<ContactsState>(STORAGE_KEY)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return contacts
  }

  async rewriteContactsByPlatform(newContacts: NativeContact[], platform: "ios" | "android") {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(STORAGE_KEY)

    // const intersectedNewContacts = newContacts.filter((con) =>
    //   currentContacts?.[platform]?.find(
    //     (currentCon) => currentCon.contactInfo?.recordID === con.recordID,
    //   ),
    // )
    // const currentContactsToRemove = currentContacts?.[platform]?.filter(
    //   (currentCon) =>
    //     !intersectedNewContacts.find(
    //       (interCon) => interCon.recordID === currentCon.contactInfo?.recordID,
    //     ),
    // )
    // const newContactsToAdd = newContacts.filter(
    //   (newCon) => !intersectedNewContacts.find((interCon) => interCon.recordID === newCon.recordID),
    // )

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

    setObjectItem(STORAGE_KEY, updContacts)

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
        email: nativeContact.emailAddresses[0]?.email as string | undefined,
        firstName: nativeContact.givenName,
        lastName: nativeContact.familyName,
        phone: nativeContact.phoneNumbers[0]?.number as string | undefined,
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
    }>(STORAGE_KEY)

    const updContacts = {
      ...currentContacts,
      [platform]: currentContacts?.[platform]?.map((con) =>
        con.id === newContact.id ? newContact : con,
      ),
    }

    setObjectItem(STORAGE_KEY, updContacts)

    return updContacts
  }

  deleteContact(id: string, platform: "android" | "ios") {
    const currentContacts = getObjectItem<{
      ios: Connection[]
      android: Connection[]
    }>(STORAGE_KEY)

    const updContacts = {
      ...currentContacts,
      [platform]: currentContacts?.[platform]?.filter((con) => con.id !== id),
    }

    setObjectItem(STORAGE_KEY, updContacts)

    return updContacts
  }
}

export const contactService = new ContactService()
