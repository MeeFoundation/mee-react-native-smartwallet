import { View } from "react-native"

export default function WalletPlaceholder() {
  // never actually shown because we prevent navigation
  return <View style={{ flex: 1, backgroundColor: "transparent" }} />
}
