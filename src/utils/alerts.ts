import { startCase } from "lodash-es"
import { Alert, Linking, Platform } from "react-native"

export const alertContactsNoPermissionAlert = () =>
  Alert.alert(
    `No permission for ${startCase(Platform.OS)} Contacts`,
    `To allow access to ${startCase(Platform.OS)} Contacts turn them on for Mee app in settings.`,
    [
      {
        text: "Settings",
        onPress: () => {
          Linking.openSettings()
        },
      },
      { text: "Maybe later" },
    ],
  )
