import { Platform } from "react-native"
import { CONTACTS_STORAGE_KEY } from "../../constants/contacts"
import { getObjectItem, setObjectItem } from "../../store/storage"

const store = getObjectItem(CONTACTS_STORAGE_KEY) ?? {}
const opposedPlatform = Platform.OS === "ios" ? "android" : "ios"

setObjectItem(CONTACTS_STORAGE_KEY, {
  ...store,
  [opposedPlatform]: [
    {
      id: "1",
      name: "Ivan Dron",
      sharedInfo: {
        firstName: "Ivan",
        lastName: "Dron",
        emails: [{ key: "Home", value: "ivan231@gmail.com" }],
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
        firstName: "Thomas",
        lastName: "Dron",
      },
      tags: [],
      contactInfo: {
        recordID: "2",
        platform: opposedPlatform,
      },
    },
  ],
})
