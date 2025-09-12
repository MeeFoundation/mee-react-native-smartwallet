import { View } from "react-native"

export default function SharePlaceholder() {
  // never actually shown because we prevent navigation
  return <View style={{ flex: 1, backgroundColor: "transparent" }} />
}
