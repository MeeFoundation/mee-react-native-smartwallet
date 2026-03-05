import { sharedGreeting } from '@mee/core';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>New App</Text>
      <Text>{sharedGreeting('world')}</Text>
    </View>
  );
}
