import type { FC, ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

import { fonts } from '@/shared/config'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  screenTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    overflow: 'hidden',
  },

  thumbnail: {
    height: 28,
    width: 28,
  },

  title: {
    fontSize: 18,
  },
})

/* -------------------------------------------------------------------------------------------------
 * ScreenTitle
 * -----------------------------------------------------------------------------------------------*/
type ScreenTitleProps = ViewProps & {
  thumbnail?: ReactNode
}

const ScreenTitle: FC<ScreenTitleProps> = ({ thumbnail, style, children, ...rest }) => {
  return (
    <View style={[styles.screenTitle, style]} {...rest}>
      {!thumbnail ? null : <View style={styles.thumbnail}>{thumbnail}</View>}
      <Typography fontFamily={fonts.publicSans.medium} numberOfLines={1} style={styles.title} weight="600">
        {children}
      </Typography>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ScreenTitle }
export type { ScreenTitleProps }
