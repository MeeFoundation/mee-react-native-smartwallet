import { Link45DegSvg, PlusCircleSvg, ShareSvg } from "@assets/bootstrap-icons"
import { BottomSheetBackDrop } from "@components/BottomSheet"
import BottomSheet from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { colors } from "@utils/theme"
import { FC, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

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
          backgroundColor: "white",
          width: "100%",
          padding: 16,
          paddingBottom: 28
        }}
      >
        <TouchableOpacity onPress={ConnectionsPress} style={styles.footerItem} hitSlop={8}>
          <Link45DegSvg
            style={{ color: isConnectionsPage ? colors.primary : "black" }}
            height={18}
            width={18}
          />

          <Text style={{ color: isConnectionsPage ? colors.primary : "black" }}>Connections</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPress} style={styles.footerItem} hitSlop={8}>
          <PlusCircleSvg height={18} width={18} />
          <Text>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddPress} style={styles.footerItem} hitSlop={8}>
          <ShareSvg height={18} width={18} />
          <Text>Share</Text>
        </TouchableOpacity>
      </View>

      <BottomSheetBackDrop ref={bottomSheetRef} title="Sites/Apps to Connect to">
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
