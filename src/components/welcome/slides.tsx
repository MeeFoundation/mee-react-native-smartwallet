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
        It’s Mee.
      </>
    ),
    text: [
      "I give you more control over your personal information as you interact with websites and mobile apps. For example, I can help you to sign in/up without a password and without surveillance.",
      "Let’s start!",
    ],
    btn: false,
  },
  {
    title: "Let’s set up your first ConnectionCard",
    text: [
      "By creating a connection I mean establishing a way for Mee to talk to apps/sites you would like to sign in/up.",
      "Choose who you want me to talk with.",
    ],
    btn: true,
  },
]
