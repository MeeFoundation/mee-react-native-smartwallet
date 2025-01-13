import { Swiper } from "@components/Swiper"
import { welcomeSlides } from "@components/welcome/slides"
import { WelcomeItem } from "@components/welcome/WelcomeItem"
import React from "react"

export const Welcome = () => {
  return <Swiper data={welcomeSlides} renderItem={({ item }) => <WelcomeItem {...item} />} />
}
