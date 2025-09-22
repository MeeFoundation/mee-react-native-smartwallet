import { colors } from "@/shared/config"
import { Swiper } from "@/shared/ui/Swiper"
import { WelcomeItem, welcomeSlides } from "@/widgets/welcome"
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
