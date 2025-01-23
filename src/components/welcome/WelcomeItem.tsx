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
            <Typography
              style={styles.title}
              fontFamily="publicSans.italic"
              allowFontScaling={false}
            >
              {title}
            </Typography>
          )}
          <View>
            {typeof text === "string" ? (
              <Typography
                style={styles.text}
                fontFamily="publicSans.light"
                weight="300"
                allowFontScaling={false}
              >
                {text}
              </Typography>
            ) : (
              text.map((t, i) => (
                <Typography
                  key={i}
                  style={styles.text}
                  fontFamily="publicSans.light"
                  weight="300"
                  allowFontScaling={false}
                >
                  {t}
                </Typography>
              ))
            )}
          </View>
        </View>
      </ImageBackground>
      <View style={styles.mascotContainer}>
        <BubblesSvg
          height="15%"
          style={{ color: colors.white, height: "15%", maxHeight: 57, marginBottom: 8 }}
        />
        <Image source={WelcomeSources.mascot} style={styles.mascotImage} />
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: colors.warning,
    gap: 9,
    paddingHorizontal: 6,
    marginTop: 40,
  },
  cloudContainer: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1.3,
    width: "100%",
  },
  mascotContainer: {
    position: "relative",
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  mascotImage: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
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
