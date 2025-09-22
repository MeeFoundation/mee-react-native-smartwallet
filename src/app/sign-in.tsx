// TODO refactor
import { CircleCheckSvg, FaceIdSvg, LogoSvg } from "@/assets/images"
import { isAuthenticatedAtom, isFirstTimeAuthAtom } from "@/features/auth"
import { colors } from "@/shared/config"
import { AppButton } from "@/shared/ui/AppButton"
import { BottomSheetBackDrop } from "@/shared/ui/BottomSheet"
import { Typography } from "@/shared/ui/Typography"
import BottomSheet from "@gorhom/bottom-sheet"
import { useAtom, useSetAtom } from "jotai"
import { useLayoutEffect, useRef, useState } from "react"
import { Linking, Platform, StyleSheet, View } from "react-native"
import ReactNativeBiometrics, { type BiometryType } from "react-native-biometrics"

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    padding: 16,
    flex: 1,
  },
  logo: {
    marginTop: 128,
    marginHorizontal: "auto",
  },
  sheetContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: 16,
  },
  infoContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  sheetText: { textAlign: "center", marginBottom: 48 },
  sheetTitle: {
    fontSize: 34,
    textAlign: "center",
  },
})

const handleOpenSettings = () => {
  if (Platform.OS === "ios") {
    // TODO add error handling
    Linking.openURL("app-settings:").catch((error) => {
      console.error("error opening settings", error)
    })
  } else {
    // TODO add error handling
    Linking.openSettings().catch((error) => {
      console.error("error opening settings", error)
    })
  }
}

const getSetupPrivacyText = (type: BiometryType | null) => {
  if (type === null) {
    return "Please enable availible authenticate type (Face ID, Touch ID, Biometrics, etc...) on your device settings to continue"
  }
  return `To store your data, Mee contains a secure data vault, which is protected by ${type}. Please set up ${type}.`
}

export default function SignIn() {
  // test that uniffi RUST function does not crush the app
  // testingRustIntegration()

  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })
  const [firstTimeAuth, setFirstTimeAuth] = useAtom(isFirstTimeAuthAtom)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const setAuthenticated = useSetAtom(isAuthenticatedAtom)
  const [setupPrivacy, setSetupPrivacy] = useState(true)
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null)

  const handleAuth = async () => {
    const { success, error } = await rnBiometrics.simplePrompt({
      promptMessage: "Authenticate to continue",
    })

    if (error) {
      // TODO add error handling
      handleAuth().catch((err) => {
        console.error("error handling auth", err)
      })
      return
    }

    // TODO make it more clear
    if (success && firstTimeAuth) {
      setFirstTimeAuth(false)
      setSetupPrivacy(false)
      return
    }

    if (success) {
      setAuthenticated(true)
    }
  }

  const checkAvailableBiometricAuth = async () => {
    const biometrics = await rnBiometrics.isSensorAvailable()

    setBiometryType(biometrics.biometryType ?? null)

    if (biometrics.available && !firstTimeAuth && biometrics.biometryType !== null) {
      // TODO add error handling
      handleAuth().catch((error) => {
        console.error("error handling auth", error)
      })
      return
    }
    setFirstTimeAuth(true)
  }

  const onPressContinue = () => {
    if (!setupPrivacy) {
      setAuthenticated(true)
      return
    }

    if (biometryType === null) {
      handleOpenSettings()
      return
    }

    // TODO add error handling
    handleAuth().catch((error) => {
      console.error("error handling auth", error)
    })
  }

  useLayoutEffect(() => {
    // TODO add error handling
    checkAvailableBiometricAuth().catch((error) => {
      console.error("error checking available biometric auth", error)
    })
    // TODO Check whether thiere must be an empty dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <View style={styles.sheetContainer}>
          <View style={styles.infoContainer}>
            {setupPrivacy ? <FaceIdSvg /> : <CircleCheckSvg color={colors.primary} />}
            <Typography style={styles.sheetTitle} weight="700">
              {setupPrivacy ? "Set up your Privacy Agent" : "All Set!"}
            </Typography>
            <Typography style={styles.sheetText}>
              {setupPrivacy
                ? getSetupPrivacyText(biometryType)
                : `Please use ${biometryType} next time you sign-in`}
            </Typography>
          </View>

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
