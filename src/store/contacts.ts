import { Connection, SharedInfo } from "@services/core.service"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"
import { Platform } from "react-native"
import Contacts from "react-native-contacts"

export const ContactsStore = atom<{
  data?: { ios?: Connection[]; android?: Connection[] }
  error?: string
}>({ data: undefined, error: undefined })

export const ContactsDetails = atomFamily((id: string) =>
  atom(
    (get) => {
      const contacts = get(ContactsStore)

      const contactFromIos = contacts.data?.ios?.find((c) => c.id === id)
      const contactFromAndroid = contactFromIos
        ? undefined
        : contacts.data?.android?.find((c) => c.id === id)
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
        ...contacts,
        data: {
          android: contacts.data?.android?.map((c) => (c.id === contact.id ? contact : c)),
          ios: contacts.data?.ios?.map((c) => (c.id === contact.id ? contact : c)),
        },
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
      oldContactInfo,
    }: { recordID: string; newContactInfo: SharedInfo; oldContactInfo: SharedInfo },
  ) => {
    try {
      // it is possible to pass only recordID, not the whole contact
      // @ts-ignore
      const nativeContact = await Contacts.getContactById(recordID)
      if (nativeContact) {
        const getEmailAddresses = () => {
          if (!oldContactInfo.email && newContactInfo.email) {
            return [
              ...nativeContact.emailAddresses,
              { label: "", email: newContactInfo.email as string },
            ]
          }
          if (oldContactInfo.email && newContactInfo.email) {
            if (oldContactInfo.email === newContactInfo.email) {
              return nativeContact.emailAddresses
            }
            return nativeContact.emailAddresses.map((emailInfo) =>
              oldContactInfo.email === emailInfo.email
                ? { ...emailInfo, email: newContactInfo.email as string }
                : emailInfo,
            )
          }
          if (oldContactInfo.email && !newContactInfo.email) {
            return nativeContact.emailAddresses.filter(
              (emailInfo) => oldContactInfo.email !== emailInfo.email,
            )
          }
          return nativeContact.emailAddresses
        }
        const getPhoneNumbers = () => {
          if (!oldContactInfo.phone && newContactInfo.phone) {
            return [
              ...nativeContact.phoneNumbers,
              { label: "", number: newContactInfo.phone as string },
            ]
          }
          if (oldContactInfo.phone && newContactInfo.phone) {
            if (oldContactInfo.phone === newContactInfo.phone) {
              return nativeContact.phoneNumbers
            }
            return nativeContact.phoneNumbers.map((phoneInfo) =>
              oldContactInfo.phone === phoneInfo.number
                ? { ...phoneInfo, number: newContactInfo.phone as string }
                : phoneInfo,
            )
          }
          if (oldContactInfo.phone && !newContactInfo.phone) {
            return nativeContact.phoneNumbers.filter(
              (phoneInfo) => oldContactInfo.phone !== phoneInfo.number,
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

      set(ContactsStore, (contacts) => ({
        ...contacts,
        data: {
          ios:
            Platform.OS === "ios"
              ? contacts.data?.ios?.map((cont) =>
                  cont.contactInfo?.recordID === recordID
                    ? { ...cont, sharedInfo: newContactInfo }
                    : cont,
                )
              : contacts.data?.ios,
          android:
            Platform.OS === "android"
              ? contacts.data?.android?.map((cont) =>
                  cont.contactInfo?.recordID === recordID
                    ? { ...cont, sharedInfo: newContactInfo }
                    : cont,
                )
              : contacts.data?.android,
        },
      }))
    } catch (err) {
      console.error(err)
    }
  },
)

export const deleteContactAtom = atom(
  null,
  async (get, set, { recordID }: { recordID: string }) => {
    const contacts = get(ContactsStore)

    try {
      // it is possible to pass only recordID, not the whole contact
      // @ts-ignore
      await Contacts.deleteContact({
        recordID,
      })
      set(ContactsStore, {
        ...contacts,
        data: {
          ios:
            Platform.OS === "ios"
              ? contacts.data?.ios?.filter((cont) => cont.contactInfo?.recordID !== recordID)
              : contacts.data?.ios,
          android:
            Platform.OS === "android"
              ? contacts.data?.android?.filter((cont) => cont.contactInfo?.recordID !== recordID)
              : contacts.data?.android,
        },
      })
    } catch (err) {
      console.error(err)
    }
  },
)
