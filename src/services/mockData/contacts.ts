import { Platform } from "react-native"
import { CONTACTS_STORAGE_KEY } from "../../constants/contacts"
import { getObjectItem, setObjectItem } from "../../store/storage"
import { ContactsState } from "../contact.service"
import { Connection } from "../core.service"

const store = getObjectItem<ContactsState>(CONTACTS_STORAGE_KEY) ?? {}
const opposedPlatform = Platform.OS === "ios" ? "android" : "ios"

setObjectItem(CONTACTS_STORAGE_KEY, {
  ...store,
  [opposedPlatform]: [
    {
      id: "1",
      name: "Ivan Dron",
      sharedInfo: {
        firstName: { title: "First Name", data: "Ivan", type: "plain" },
        lastName: { title: "Last Name", data: "Dron", type: "plain" },
        emails: {
          title: "Emails",
          data: [
            {
              key: "Home",
              value: "ivan231@gmail.com",
            },
          ],
          schema: [
            {
              key: { title: "Label", type: "plain" },
              value: { title: "Value", type: "plain-email" },
            },
          ],
          type: "nested",
        },
      },
      tags: [],
      contactInfo: {
        recordID: "1",
        platform: opposedPlatform,
      },
    },
    {
      id: "2",
      name: "Thomas Dron",
      sharedInfo: {
        firstName: { title: "First Name", data: "Thomas", type: "plain" },
        lastName: { title: "Last Name", data: "Dron", type: "plain" },
      },
      tags: [],
      contactInfo: {
        recordID: "2",
        platform: opposedPlatform,
      },
    },
  ] as Connection[],
})
