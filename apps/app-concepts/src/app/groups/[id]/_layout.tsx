import { Stack } from 'expo-router'
import type { FC } from 'react'

/* -------------------------------------------------------------------------------------------------
 * GroupLayout
 * -----------------------------------------------------------------------------------------------*/
const GroupLayout: FC = () => (
  <Stack
    screenOptions={{
      animation: 'none',
      contentStyle: { backgroundColor: 'transparent' },
      headerShown: false,
    }}
  />
)

/* -----------------------------------------------------------------------------------------------*/

export default GroupLayout
