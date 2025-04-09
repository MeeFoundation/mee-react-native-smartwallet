import { Connection, SharedInfo } from "@services/core.service"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { PermissionsAndroid, Platform } from "react-native"
import Contacts from "react-native-contacts"
import { PromiseOrType } from "../../@types/utils"
import { ContactsState, contactService } from "../services/contact.service"
import { alertContactsNoPermissionAlert } from "../utils/alerts"

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
        // it is possible to pass only recordID, not the whole contact
        // @ts-ignore
        const nativeContact = await Contacts.getContactById(recordID)
        if (nativeContact) {
          const getEmailAddresses = () => {
            if (!oldContact.sharedInfo.email && newContactInfo.email) {
              return [
                ...nativeContact.emailAddresses,
                { label: "", email: newContactInfo.email as string },
              ]
            }
            if (oldContact.sharedInfo.email && newContactInfo.email) {
              if (oldContact.sharedInfo.email === newContactInfo.email) {
                return nativeContact.emailAddresses
              }
              return nativeContact.emailAddresses.map((emailInfo) =>
                oldContact.sharedInfo.email === emailInfo.email
                  ? { ...emailInfo, email: newContactInfo.email as string }
                  : emailInfo,
              )
            }
            if (oldContact.sharedInfo.email && !newContactInfo.email) {
              return nativeContact.emailAddresses.filter(
                (emailInfo) => oldContact.sharedInfo.email !== emailInfo.email,
              )
            }
            return nativeContact.emailAddresses
          }
          const getPhoneNumbers = () => {
            if (!oldContact.sharedInfo.phone && newContactInfo.phone) {
              return [
                ...nativeContact.phoneNumbers,
                { label: "", number: newContactInfo.phone as string },
              ]
            }
            if (oldContact.sharedInfo.phone && newContactInfo.phone) {
              if (oldContact.sharedInfo.phone === newContactInfo.phone) {
                return nativeContact.phoneNumbers
              }
              return nativeContact.phoneNumbers.map((phoneInfo) =>
                oldContact.sharedInfo.phone === phoneInfo.number
                  ? { ...phoneInfo, number: newContactInfo.phone as string }
                  : phoneInfo,
              )
            }
            if (oldContact.sharedInfo.phone && !newContactInfo.phone) {
              return nativeContact.phoneNumbers.filter(
                (phoneInfo) => oldContact.sharedInfo.phone !== phoneInfo.number,
              )
            }
            return nativeContact.phoneNumbers
          }
          await Contacts.updateContact({
            ...nativeContact,
            givenName: newContactInfo.firstName,
            familyName: newContactInfo.lastName,
            emailAddresses: getEmailAddresses(),
            phoneNumbers: getPhoneNumbers(),
          })
        }

        const getNewContact = (oldCont: Connection, newContInfo: SharedInfo) => ({
          ...oldCont,
          name: newContInfo.firstName + " " + newContInfo.lastName,
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
