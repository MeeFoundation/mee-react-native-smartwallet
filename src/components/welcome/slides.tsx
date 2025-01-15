import { Typography } from "@components/Typography"
import { colors } from "@utils/theme"
import React from "react"
import { StyleSheet } from "react-native"
import { WelcomeSlide } from "./WelcomeItem"

const styles = StyleSheet.create({
  titleHello: {
    color: colors.warning,
    fontSize: 30,
    fontStyle: "normal",
    lineHeight: 36,
  },
})

export const welcomeSlides: WelcomeSlide[] = [
  {
    title: (
      <>
        <Typography style={styles.titleHello} fontFamily="publicSans.bold" weight="700">
          Hello.
        </Typography>{" "}
        It's Mee, your digital twin
      </>
    ),
    text: [
      "I represent you on the internet. I put you in control of your personal information as you interact with Mee-compatible websites and mobile apps. I help you to sign in/up without a password and without surveillance.",
      "Let’s start!",
    ],
    btn: false,
  },
  {
    text: [
      "I need to check your browser's local storage to see if you have interacted with any sites/apps using Mee.",
      'Click "Get Started" to continue.',
    ],
    btn: true,
  },
]
