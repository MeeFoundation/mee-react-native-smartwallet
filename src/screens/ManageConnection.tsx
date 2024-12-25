import { ProviderCard } from "@components/ProviderCard"
import { RootStackParamList } from "@navigation/rootNavigation"
import { RouteProp, useRoute } from "@react-navigation/native"
import { colors } from "@utils/theme"
import React from "react"
import { StyleSheet, View } from "react-native"

export const ManageConnection = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Manage Connection">>()

  return (
    <View style={styles.page}>
      <ProviderCard logo={require("../assets/images/provider-logo/times.png")} />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
  },
})
