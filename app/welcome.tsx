import { Swiper } from "@/components/Swiper"
import { welcomeSlides } from "@/components/welcome/slides"
import { WelcomeItem } from "@/components/welcome/WelcomeItem"
import { colors } from "@/constants/colors"
import React, { useEffect } from "react"
import { Platform, StatusBar } from "react-native"

export default function Welcome() {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.warning)
    }
  }, [])

  return <Swiper data={welcomeSlides} renderItem={({ item }) => <WelcomeItem {...item} />} />
}
