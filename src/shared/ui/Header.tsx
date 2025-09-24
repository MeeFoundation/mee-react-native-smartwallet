import { useSetAtom } from 'jotai'
import { type FC, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View, type ViewProps } from 'react-native'

import { colors } from '@/shared/config'
import { useThemeColor } from '@/shared/lib/useThemeColor'
import { drawerIsOpenedAtom } from '@/shared/model'
import { Typography } from '@/shared/ui/Typography'

import { IconSymbol } from './IconSymbol'

/* -------------------------------------------------------------------------------------------------
 * HeaderRight
 * -----------------------------------------------------------------------------------------------*/
export const HeaderRight = () => {
  const setDrawerIsOpened = useSetAtom(drawerIsOpenedAtom)
  const openDrawer = useCallback(() => setDrawerIsOpened(true), [setDrawerIsOpened])

  const iconColor = useThemeColor('white')

  return (
    <View style={[styles.menu, styles.headerRight]}>
      <TouchableOpacity style={styles.pressable}>
        <IconSymbol color={iconColor} name="magnifying-glass.outlined" strokeWidth={2} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.pressable}>
        <IconSymbol color={iconColor} name="bell.outlined" strokeWidth={2} />
      </TouchableOpacity>

      <TouchableOpacity onPress={openDrawer} style={styles.pressable}>
        <IconSymbol color={iconColor} name="bars-3.outlined" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * HeaderLeft
 * -----------------------------------------------------------------------------------------------*/
type HeaderLeftProps = ViewProps

export const HeaderLeft: FC<HeaderLeftProps> = ({ style, children, ...rest }) => (
  <View style={[styles.headerLeft, style]} {...rest}>
    <Typography className="font-bold" style={styles.text}>
      {children}
    </Typography>
  </View>
)

/* -----------------------------------------------------------------------------------------------*/

const styles = StyleSheet.create({
  headerLeft: {
    paddingHorizontal: 0,
    // FIXME adjust padding
    paddingStart: 16,
  },
  headerRight: {
    // FIXME adjust padding
    paddingEnd: 22,
    paddingHorizontal: 0,
  },
  menu: { flexDirection: 'row' },
  pressable: { padding: 8 },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 24,
  },
})
