import { CircleCheckSvg, FaceIdSvg, LogoSvg } from "@assets/index"
import { AppButton } from "@components/AppButton"
import { BottomSheetBackDrop } from "@components/BottomSheet"
import { Typography } from "@components/Typography"
import BottomSheet from "@gorhom/bottom-sheet"
import { isAuthenticatedState, isFirstTimeAuthState } from "@store/index"
import { colors } from "@utils/theme"
import { useAtom, useSetAtom } from "jotai"
import { useLayoutEffect, useRef, useState } from "react"
import { Linking, Platform, StyleSheet, View } from "react-native"
import ReactNativeBiometrics, { BiometryType } from "react-native-biometrics"

const handleOpenSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:")
  } else {
    Linking.openSettings()
  }
}

const getSetupPrivacyText = (type: BiometryType | null) => {
  if (type === null) {
    return "Please enable availible authenticate type (Face ID, Touch ID, Biometrics, etc...) on your device settings to continue"
  }
  return `To store your data, Mee contains a secure data vault, which is protected by ${type}. Please set up ${type}.`
}

export const Login = () => {
  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })
  const [firstTimeAuth, setFirstTimeAuth] = useAtom(isFirstTimeAuthState)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const setAuthenticated = useSetAtom(isAuthenticatedState)
  const [setupPrivacy, setSetupPrivacy] = useState(true)
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null)

  const handleAuth = async () => {
    const { success, error } = await rnBiometrics.simplePrompt({
      promptMessage: "Authenticate to continue",
    })

    if (error) {
      handleAuth()
      return
    }

    if (success && firstTimeAuth) {
      setFirstTimeAuth(false)
      setSetupPrivacy(false)
      return
    }

    if (success) setAuthenticated(true)
  }

  const checkAvailibleBiometricAuth = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable()

    setBiometryType(biometryType ?? null)

    if (available && !firstTimeAuth && biometryType !== null) {
      handleAuth()
      return
    }
    setFirstTimeAuth(true)
  }

  const onPressContinue = async () => {
    if (!setupPrivacy) {
      setAuthenticated(true)
      return
    }

    if (biometryType === null) {
      handleOpenSettings()
      return
    }
    handleAuth()
  }

  useLayoutEffect(() => {
    checkAvailibleBiometricAuth()
  }, [])

  return (
    <View style={styles.page}>
      <LogoSvg style={styles.logo} color={colors.primary} />

      <BottomSheetBackDrop
        index={firstTimeAuth ? 0 : -1}
        enableContentPanningGesture={false}
        snapPoints={setupPrivacy ? [450] : [342]}
        ref={bottomSheetRef}
        backDropProps={{ pressBehavior: "none" }}
      >
        <View style={styles.sheetContaier}>
          {setupPrivacy ? <FaceIdSvg /> : <CircleCheckSvg color={colors.primary} />}
          <Typography style={styles.sheetTitle} weight="700">
            {setupPrivacy ? "Set up your Privacy Agent" : "All Set!"}
          </Typography>
          <Typography style={styles.sheetText}>
            {setupPrivacy
              ? getSetupPrivacyText(biometryType)
              : `Please use ${biometryType} next time you sign-in`}
          </Typography>

          <AppButton
            text="Continue"
            fullWidth
            variant="tertiary"
            size="lg"
            textStyles={{ color: colors.link }}
            hitSlop={12}
            onPress={onPressContinue}
          />
        </View>
      </BottomSheetBackDrop>
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
  sheetContaier: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  sheetText: { textAlign: "center", marginBottom: 48 },
  sheetTitle: {
    fontSize: 34,
    textAlign: "center",
  },
})
