import { Platform } from 'react-native'

import { CONTACTS_STORAGE_KEY } from '@/shared/config'
import { getObjectItem, setObjectItem } from '@/shared/model'

const store = getObjectItem(CONTACTS_STORAGE_KEY) ?? {}
const opposedPlatform = Platform.OS === 'ios' ? 'android' : 'ios'

setObjectItem(CONTACTS_STORAGE_KEY, {
  ...store,
  [opposedPlatform]: [
    {
      contactInfo: {
        platform: opposedPlatform,
        recordID: '1',
      },
      id: '1',
      name: 'Ivan Dron',
      sharedInfo: {
        emails: [{ key: 'Home', value: 'ivan231@gmail.com' }],
        firstName: 'Ivan',
        lastName: 'Dron',
      },
      tags: [],
    },
    {
      contactInfo: {
        platform: opposedPlatform,
        recordID: '2',
      },
      id: '2',
      name: 'Thomas Dron',
      sharedInfo: {
        firstName: 'Thomas',
        lastName: 'Dron',
      },
      tags: [],
    },
  ],
})
