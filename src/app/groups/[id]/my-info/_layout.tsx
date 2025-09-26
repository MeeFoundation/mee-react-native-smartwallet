import { Stack } from 'expo-router'
import type { FC } from 'react'

/* -------------------------------------------------------------------------------------------------
 * MyInfoLayout
 * -----------------------------------------------------------------------------------------------*/
const MyInfoLayout: FC = () => (
  <Stack
    screenOptions={{
      animation: 'none',
      contentStyle: { backgroundColor: 'transparent' },
      headerShown: false,
    }}
  />
)

/* -----------------------------------------------------------------------------------------------*/

export default MyInfoLayout
