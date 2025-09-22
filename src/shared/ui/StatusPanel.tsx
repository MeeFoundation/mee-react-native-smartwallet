import type { FC, ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

import { colors, fonts } from '@/shared/config'

import { Typography } from './Typography'

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    paddingTop: 4,
  },

  descriptionDanger: {
    // FIXME move to constants and add dark theme
    color: '#5F2120',
  },
  statusPanel: {
    borderColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    paddingInline: 16,
    paddingVertical: 12,
  },

  statusPanelDanger: {
    // FIXME move to constants and add dark theme
    backgroundColor: '#FDEDED',
  },

  title: {
    fontSize: 16,
    letterSpacing: -0.33,
  },

  titleDanger: {
    // FIXME move to constants and add dark theme
    color: '#5F2120',
  },
})
/* -------------------------------------------------------------------------------------------------
 * StatusPanel
 * -----------------------------------------------------------------------------------------------*/
type StatusPanelProps = Omit<ViewProps, 'children'> & {
  variant: 'danger'
  title: ReactNode
  description: ReactNode
}

const StatusPanel: FC<StatusPanelProps> = ({ title, description, style, variant, ...rest }) => {
  return (
    <View style={[styles.statusPanel, variant === 'danger' && styles.statusPanelDanger, style]} {...rest}>
      <Typography
        fontFamily={fonts.publicSans.bold}
        style={[styles.title, variant === 'danger' && styles.titleDanger]}
        weight="700"
      >
        {title}
      </Typography>
      <Typography style={[styles.description, variant === 'danger' && styles.descriptionDanger]}>
        {description}
      </Typography>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { StatusPanel }
export type { StatusPanelProps }
