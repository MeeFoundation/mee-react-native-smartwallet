import { LogoSvg } from "@assets/index"
import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { useEffect } from "react"
import { Alert, StyleSheet, View } from "react-native"
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics"

export const Login = () => {
  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })
  const navigation = useNavigation()

  const handleBiometricAuth = async () => {
    try {
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: "Authenticate to continue",
      })

      if (error) {
        console.error("[handleBiometricAuth] Error:", error)
      }

      if (success) {
        Alert.alert("Success", "Biometric authentication successful")
        navigation.navigate("Connections")
        return true
      } else {
        Alert.alert("Authentication failed", "Biometric authentication failed")
        return false
      }
    } catch (error) {
      console.error("[handleBiometricAuth] Error:", error)
      Alert.alert("Error", "Biometric authentication failed from device")
      return false
    }
  }

  const enableBiometricAuth = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable()
    console.log({ available, biometryType })

    switch (biometryType) {
      case BiometryTypes.TouchID: {
        // do something
        break
      }

      case BiometryTypes.FaceID: {
        // do something
        break
      }

      case BiometryTypes.Biometrics: {
        // do something
        break
      }
      default: {
        Alert.alert(
          "Biometrics not supported",
          "This device does not support biometric authentication.",
        )
      }
    }
  }

  useEffect(() => {
    handleBiometricAuth()
  }, [])

  return (
    <View style={styles.page}>
      <LogoSvg style={styles.logo} color={colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    padding: 16,
    flex: 1,
  },
  logo: {
    paddingTop: 128,
    marginHorizontal: "auto",
  },
})
