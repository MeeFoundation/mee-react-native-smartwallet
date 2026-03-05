import type { FC, ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native'
import { AdjustmentsVerticalIcon } from 'react-native-heroicons/outline'

import { colors } from '@/shared/config'
import { Typography } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  filterSelectButton: {
    alignItems: 'center',
    backgroundColor: colors['white/95'],
    borderColor: colors['black/10'],
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  text: {
    fontWeight: 500,
  },
})

/* -------------------------------------------------------------------------------------------------
 * FiltersSelectButton
 * -----------------------------------------------------------------------------------------------*/
type FiltersSelectButtonProps = TouchableOpacityProps & {
  icon?: ReactNode
}

const FiltersSelectButton: FC<FiltersSelectButtonProps> = ({ style, icon, ...props }) => (
  <TouchableOpacity onPress={props.onPress} style={styles.filterSelectButton}>
    <Typography style={styles.text}>{props.children ?? 'Filters'}</Typography>
    {icon ?? <AdjustmentsVerticalIcon color={colors.black} size={20} />}
  </TouchableOpacity>
)

/* -----------------------------------------------------------------------------------------------*/

export { FiltersSelectButton }
export type { FiltersSelectButtonProps }
