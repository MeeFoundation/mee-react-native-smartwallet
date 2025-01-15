import { BubblesSvg, WelcomeSources } from "@assets/index"
import { AppButton } from "@components/AppButton"
import { Typography } from "@components/Typography"
import { useNavigation } from "@react-navigation/native"
import { isWelcomeViewedAtom } from "@store/index"
import { colors } from "@utils/theme"
import { useSetAtom } from "jotai"
import { ReactNode } from "react"
import { Dimensions, Image, ImageBackground, StyleSheet, View } from "react-native"

export type WelcomeSlide = {
  title?: ReactNode
  text: string | string[]
  btn?: boolean
}

export const WelcomeItem = ({ title, text, btn = false }: WelcomeSlide) => {
  const navigation = useNavigation()
  const setIsWelcomeViewedAtom = useSetAtom(isWelcomeViewedAtom)
  const handlePress = () => {
    setIsWelcomeViewedAtom(true)
    navigation.navigate("Login")
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={WelcomeSources.cloud}
        style={styles.cloudContainer}
        imageStyle={{
          resizeMode: "cover",
          width: "100%",
          height: "100%",
        }}
      >
        <View
          style={{
            paddingHorizontal: 40,
            paddingTop: 54,
            paddingBottom: 39,
          }}
        >
          {title && (
            <Typography style={styles.title} fontFamily="publicSans.italic">
              {title}
            </Typography>
          )}
          <View>
            {typeof text === "string" ? (
              <Typography style={styles.text} fontFamily="publicSans.light" weight="300">
                {text}
              </Typography>
            ) : (
              text.map((t, i) => (
                <Typography key={i} style={styles.text} fontFamily="publicSans.light" weight="300">
                  {t}
                </Typography>
              ))
            )}
          </View>
        </View>
      </ImageBackground>
      <BubblesSvg style={{ color: colors.white }} />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <Image source={WelcomeSources.mascot} />
        <View style={{ width: "100%", height: 51 }}>
          {btn && (
            <AppButton
              onPress={handlePress}
              variant="secondary"
              text="Get Started"
              style={styles.button}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.warning,
    gap: 9,
    paddingHorizontal: 6,
  },
  cloudContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    aspectRatio: 1.3,
  },
  title: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 36,
    fontStyle: "italic",
    marginBottom: 8,
    zIndex: 1,
    textAlign: "center",
  },
  text: {
    color: colors.primary,
    fontWeight: "light",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: -1,
  },
})
