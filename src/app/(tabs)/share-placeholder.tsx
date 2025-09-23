import { View } from 'react-native'

export default function SharePlaceholder() {
  // never actually shown because we prevent navigation
  return <View style={{ backgroundColor: 'transparent', flex: 1 }} />
}
