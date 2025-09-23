import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { PermissionsAndroid, Platform } from 'react-native'
import Contacts, { type Contact } from 'react-native-contacts'
import type { PostalAddress } from 'react-native-contacts/type'

import type { Connection, SharedInfo } from '@/entities/connection/@x/contact'

import { alertContactsNoPermissionAlert } from '@/shared/lib/alerts'

import { type ContactsState, contactService } from './service'
import type { PromiseOrType } from '@/@types/utils'

const ContactsDefaultStore = atom<PromiseOrType<ContactsState | null>>(() => contactService.getContacts())
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
      const contactFromAndroid = contactFromIos ? undefined : contacts?.android?.find((c) => c.id === id)
      if (!contactFromIos && !contactFromAndroid) {
        console.error(`Contact with id ${id} not found`)
      }

      const contact = contactFromIos ?? contactFromAndroid
      if (!contact) throw new Error(`Contact with id ${id} not found`)
      return { contact, platform: contactFromIos ? 'ios' : 'android' }
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
  let contacts: Contact[]
  try {
    contacts = await Contacts.getAll()
  } catch (err) {
    alertContactsNoPermissionAlert()
    console.error('Error fetching contacts: ', err)
    return undefined
  }

  const result = await contactService.rewriteContactsByPlatform(contacts, 'ios')

  set(ContactsStore, result)

  return result
})

export const setAndroidContactsAtom = atom(null, async (_, set) => {
  const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
  if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
    alertContactsNoPermissionAlert()
    console.error('Permission denied')
    return undefined
  }
  const contacts = await Contacts.getAll()

  const result = await contactService.rewriteContactsByPlatform(contacts, 'android')

  set(ContactsStore, result)

  return result
})
export const updateContactAtom = atom(
  null,
  async (
    get,
    set,
    { recordID, newContactInfo, oldContact }: { recordID: string; newContactInfo: SharedInfo; oldContact: Connection },
  ) => {
    if (Platform.OS === oldContact.contactInfo?.platform) {
      try {
        if (Platform.OS === 'android') {
          const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)

          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            alertContactsNoPermissionAlert()
            console.error('Write permission denied')
            return
          }
        }

        const nativeContact = await Contacts.getContactById(recordID)
        if (nativeContact) {
          await Contacts.updateContact({
            ...nativeContact,
            emailAddresses: newContactInfo.emails?.map((emailInfo) => ({
              email: emailInfo.value,
              label: emailInfo.key,
            })),
            familyName: newContactInfo.lastName,
            givenName: newContactInfo.firstName,
            phoneNumbers: newContactInfo.phones?.map((phoneInfo) => ({
              label: phoneInfo.key,
              number: phoneInfo.value,
            })),
            postalAddresses: newContactInfo.addresses as unknown as PostalAddress[],
          })
        }

        const getNewContact = (oldCont: Connection, newContInfo: SharedInfo) => ({
          ...oldCont,
          name: `${newContInfo.firstName} ${newContInfo.lastName}`,
          sharedInfo: newContInfo,
        })
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          contactService.updateContact(getNewContact(oldContact, newContactInfo), Platform.OS)
        }

        const contacts = await get(ContactsStore)
        set(ContactsStore, {
          android:
            Platform.OS === 'android'
              ? contacts?.android?.map((cont) =>
                  cont.contactInfo?.recordID === recordID ? { ...cont, sharedInfo: newContactInfo } : cont,
                )
              : contacts?.android,
          ios:
            Platform.OS === 'ios'
              ? contacts?.ios?.map((cont) =>
                  cont.contactInfo?.recordID === recordID ? getNewContact(cont, newContactInfo) : cont,
                )
              : contacts?.ios,
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
)

export const deleteContactAtom = atom(null, async (get, set, { contact }: { contact: Connection }) => {
  if (Platform.OS === contact.contactInfo?.platform) {
    const contacts = await get(ContactsStore)

    try {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)

        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          alertContactsNoPermissionAlert()
          console.error('Write permission denied')
          return
        }
      }
      // @ts-expect-error it is possible to pass only recordID, not the whole contact
      await Contacts.deleteContact({
        recordID: contact.contactInfo?.recordID,
      })
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await contactService.deleteContact(contact.id, Platform.OS)
      }
      set(ContactsStore, {
        android:
          Platform.OS === 'android'
            ? contacts?.android?.filter((cont) => cont.contactInfo?.recordID !== contact.contactInfo?.recordID)
            : contacts?.android,
        ios:
          Platform.OS === 'ios'
            ? contacts?.ios?.filter((cont) => cont.contactInfo?.recordID !== contact.contactInfo?.recordID)
            : contacts?.ios,
      })

      return true
    } catch (err) {
      console.error(err)
    }
  }
})
