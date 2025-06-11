import { Connection, NestedDataArray, SharedInfo } from "@services/core.service"
import { alertContactsNoPermissionAlert } from "@utils/alerts"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { PermissionsAndroid, Platform } from "react-native"
import Contacts from "react-native-contacts"
import { PostalAddress } from "react-native-contacts/type"
import { PromiseOrType } from "../../@types/utils"
import { ContactsState, contactService } from "../services/contact.service"

const ContactsDefaultStore = atom<PromiseOrType<ContactsState | null>>(() =>
  contactService.getContacts(),
)
export const ContactsLocalStore = atom<PromiseOrType<ContactsState | null>>()

export const ContactsStore = atom(
  (get) => get(ContactsLocalStore) ?? get(ContactsDefaultStore),
  (_, set, data: ContactsState) => {
    set(ContactsLocalStore, data)
  },
)

export const ContactsDetails = atomFamily((id: string) =>
  atom(
    async (get) => {
      const contacts = await get(ContactsStore)

      const contactFromIos = contacts?.ios?.find((c) => c.id === id)
      const contactFromAndroid = contactFromIos
        ? undefined
        : contacts?.android?.find((c) => c.id === id)
      if (!contactFromIos && !contactFromAndroid) {
        console.error(`Contact with id ${id} not found`)
      }
      return {
        contact: (contactFromIos ?? contactFromAndroid)!,
        platform: contactFromIos ? "ios" : "android",
      }
    },
    async (get, set, contact: Connection) => {
      const contacts = await get(ContactsStore)
      const updatedContacts = {
        android: contacts?.android?.map((c) => (c.id === contact.id ? contact : c)),
        ios: contacts?.ios?.map((c) => (c.id === contact.id ? contact : c)),
      }
      set(ContactsStore, updatedContacts)
    },
  ),
)

export const setIosContactsAtom = atom(null, async (_, set) => {
  let contacts
  try {
    contacts = await Contacts.getAll()
  } catch (err) {
    alertContactsNoPermissionAlert()
    console.error("Error fetching contacts: ", err)
    return undefined
  }

  const result = await contactService.rewriteContactsByPlatform(contacts, "ios")

  set(ContactsStore, result)

  return result
})

export const setAndroidContactsAtom = atom(null, async (_, set) => {
  const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
  if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
    alertContactsNoPermissionAlert()
    console.error("Permission denied")
    return undefined
  }
  const contacts = await Contacts.getAll()

  const result = await contactService.rewriteContactsByPlatform(contacts, "android")

  set(ContactsStore, result)

  return result
})
export const updateContactAtom = atom(
  null,
  async (
    get,
    set,
    {
      recordID,
      newContactInfo,
      oldContact,
    }: { recordID: string; newContactInfo: SharedInfo; oldContact: Connection },
  ) => {
    if (Platform.OS === oldContact.contactInfo?.platform) {
      try {
        if (Platform.OS === "android") {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          )

          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            alertContactsNoPermissionAlert()
            console.error("Write permission denied")
            return
          }
        }

        const nativeContact = await Contacts.getContactById(recordID)
        if (nativeContact) {
          await Contacts.updateContact({
            ...nativeContact,
            givenName: newContactInfo.firstName.data as string,
            familyName: newContactInfo.lastName.data as string,
            emailAddresses: (newContactInfo.emails?.data as NestedDataArray)?.map((emailInfo) => ({
              label: emailInfo.key as string,
              email: emailInfo.value as string,
            })),
            phoneNumbers: (newContactInfo.phones?.data as NestedDataArray)?.map((phoneInfo) => ({
              label: phoneInfo.key as string,
              number: phoneInfo.value as string,
            })),
            postalAddresses: newContactInfo.addresses
              ?.data as NestedDataArray as unknown as PostalAddress[],
          })
        }

        const getNewContact = (oldCont: Connection, newContInfo: SharedInfo) => ({
          ...oldCont,
          name: `${newContInfo.firstName.data} ${newContInfo.lastName.data}`,
          sharedInfo: newContInfo,
        })
        if (Platform.OS === "ios" || Platform.OS === "android") {
          contactService.updateContact(getNewContact(oldContact, newContactInfo), Platform.OS)
        }

        const contacts = await get(ContactsStore)
        set(ContactsStore, {
          ios:
            Platform.OS === "ios"
              ? contacts?.ios?.map((cont) =>
                  cont.contactInfo?.recordID === recordID
                    ? getNewContact(cont, newContactInfo)
                    : cont,
                )
              : contacts?.ios,
          android:
            Platform.OS === "android"
              ? contacts?.android?.map((cont) =>
                  cont.contactInfo?.recordID === recordID
                    ? { ...cont, sharedInfo: newContactInfo }
                    : cont,
                )
              : contacts?.android,
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
)

export const deleteContactAtom = atom(
  null,
  async (get, set, { contact }: { contact: Connection }) => {
    if (Platform.OS === contact.contactInfo?.platform) {
      const contacts = await get(ContactsStore)

      try {
        if (Platform.OS === "android") {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          )

          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            alertContactsNoPermissionAlert()
            console.error("Write permission denied")
            return
          }
        }
        // it is possible to pass only recordID, not the whole contact
        // @ts-ignore
        await Contacts.deleteContact({
          recordID: contact.contactInfo?.recordID,
        })
        if (Platform.OS === "ios" || Platform.OS === "android") {
          await contactService.deleteContact(contact.id, Platform.OS)
        }
        set(ContactsStore, {
          ios:
            Platform.OS === "ios"
              ? contacts?.ios?.filter(
                  (cont) => cont.contactInfo?.recordID !== contact.contactInfo?.recordID,
                )
              : contacts?.ios,
          android:
            Platform.OS === "android"
              ? contacts?.android?.filter(
                  (cont) => cont.contactInfo?.recordID !== contact.contactInfo?.recordID,
                )
              : contacts?.android,
        })

        return true
      } catch (err) {
        console.error(err)
      }
    }
  },
)
