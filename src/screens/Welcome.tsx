import { Swiper } from "@components/Swiper"
import { welcomeSlides } from "@components/welcome/slides"
import { WelcomeItem } from "@components/welcome/WelcomeItem"
import { colors } from "@utils/theme"
import React from "react"
import { Dimensions, StyleSheet } from "react-native"

export const Welcome = () => {
  return <Swiper data={welcomeSlides} renderItem={({ item }) => <WelcomeItem {...item} />} />
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
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
