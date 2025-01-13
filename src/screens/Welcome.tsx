import { BubblesSvg, ChevronLeftSvg, WelcomeSources } from "@assets/index"
import { Typography } from "@components/Typography"
import { useNavigation } from "@react-navigation/native"
import { hexAlphaColor } from "@utils/color"
import { colors } from "@utils/theme"
import { useRef } from "react"
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

export const Welcome = () => {
  const navigation = useNavigation()
  const sliderPos = useRef(new Animated.Value(0)).current

  const handlePress = () => {
    navigation.navigate("Get Started")
  }

  const handleSlider = (index: number) => {
    Animated.timing(sliderPos, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start()
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
        <View style={{ paddingHorizontal: 31 }}>
          <Typography style={styles.title} fontFamily="publicSans.italic">
            <Typography style={styles.titleHello} fontFamily="publicSans.bold" weight="700">
              Hello.
            </Typography>{" "}
            It’s Mee.
          </Typography>
          <Typography style={styles.text} fontFamily="publicSans.light" weight="300">
            I give you more control over your personal information as you interact with websites and
            mobile apps. For example, I can help you to sign in/up without a password and without
            surveillance.
          </Typography>
          <Typography style={styles.text} fontFamily="publicSans.light" weight="300">
            Let’s start!
          </Typography>
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
          {/* <AppButton onPress={handlePress} variant="secondary" text="Continue" style={styles.button} /> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            padding: 12,
          }}
        >
          <TouchableOpacity onPress={() => handleSlider(0)}>
            <ChevronLeftSvg width={16} height={16} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: hexAlphaColor(colors.primary, 50),
              }}
            />
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: hexAlphaColor(colors.primary, 50),
              }}
            />
            <Animated.View
              style={{
                position: "absolute",
                top: 4,
                left: sliderPos,
                width: 20,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
                zIndex: 2,
              }}
            />
          </View>
          <TouchableOpacity onPress={() => handleSlider(16)}>
            <ChevronLeftSvg
              width={16}
              height={16}
              color={colors.primary}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  titleHello: {
    color: colors.warning,
    fontSize: 30,
    fontStyle: "normal",
    lineHeight: 36,
  },
  text: {
    color: colors.primary,
    fontWeight: "light",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  image: {
    width: Dimensions.get("screen").width - 28,
    aspectRatio: 2.12,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 30,
  },
  description: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  button: {
    width: "100%",
    paddingHorizontal: 16,
  },
})
