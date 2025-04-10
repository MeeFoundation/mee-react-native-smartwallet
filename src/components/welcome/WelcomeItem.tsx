import { BubblesSvg, MeeMascotSvg } from "@assets/index"
import { AppButton } from "@components/AppButton"
import { useNavigation } from "@react-navigation/native"
import { customHeader, isConnectionPeopleView, isWelcomeViewedAtom } from "@store/index"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import { Dimensions, StyleSheet, View } from "react-native"
import { SvgProps } from "react-native-svg"

export type WelcomeSlide = {
  btn?: boolean
  CloudImage: React.FunctionComponent<SvgProps>
}

export const WelcomeItem = ({ btn = false, CloudImage }: WelcomeSlide) => {
  const navigation = useNavigation()
  const setIsWelcomeViewedAtom = useSetAtom(isWelcomeViewedAtom)
  const setConnectionPeopleView = useSetAtom(isConnectionPeopleView)
  const setCustomHeader = useSetAtom(customHeader)
  const handlePress = () => {
    setIsWelcomeViewedAtom(true)
    navigation.navigate("Companies")
    setConnectionPeopleView(false)
    setCustomHeader(undefined)
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <CloudImage height="100%" width="100%" />
      </View>
      <View style={styles.image}>
        <BubblesSvg style={{ color: colors.white, marginBottom: 8 }} height="15%" />
        <MeeMascotSvg height="85%" width="100%" />
      </View>
      <View style={{ width: "100%", height: 51, alignSelf: "flex-end" }}>
        {btn && (
          <AppButton
            onPress={handlePress}
            variant="secondary"
            text="Get Started"
            style={styles.button}
            hitSlop={12}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.warning,
    paddingHorizontal: 6,
    marginTop: 40,
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    lineHeight: 36,
    fontStyle: "italic",
    marginBottom: 8,
    zIndex: 1,
    textAlign: "center",
  },
  text: {
    color: colors.primary,
    fontWeight: "light",
    fontSize: 14,
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: -1,
  },
})
