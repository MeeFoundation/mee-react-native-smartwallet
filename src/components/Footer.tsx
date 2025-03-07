import { BottomSheetBackDrop } from "@components/BottomSheet"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { FC, useRef } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { LinkIcon, PlusCircleIcon, ShareIcon } from "react-native-heroicons/outline"
import { Typography } from "./Typography"

type FooterProps = {
  isConnectionsPage?: boolean
}

export const Footer: FC<FooterProps> = ({ isConnectionsPage = false }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const navigation = useNavigation()
  const onAddPress = () => {
    bottomSheetRef.current?.expand()
  }
  const ConnectionsPress = () => {
    navigation.navigate("Connections")
  }

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          padding: 16,
          paddingBottom: 28,
          zIndex: 1,
        }}
      >
        <TouchableOpacity onPress={ConnectionsPress} style={styles.footerItem} hitSlop={8}>
          <LinkIcon size={20} color={isConnectionsPage ? colors.primary : "black"} />
          <Typography style={{ color: isConnectionsPage ? colors.primary : "black" }}>
            Connections
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPress} style={styles.footerItem} hitSlop={8}>
          <PlusCircleIcon size={20} color={"black"} />
          <Typography>Connect</Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPress} style={styles.footerItem} hitSlop={8}>
          <ShareIcon size={20} color={"black"} />
          <Typography>Share</Typography>
        </TouchableOpacity>
      </View>

      <BottomSheetBackDrop ref={bottomSheetRef} title="Connect to">
        <View style={styles.addConnectionContainer}></View>
      </BottomSheetBackDrop>
    </>
  )
}

const styles = StyleSheet.create({
  addConnectionContainer: {
    flex: 1,
    flexDirection: "column",
  },
  footerItem: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
})
