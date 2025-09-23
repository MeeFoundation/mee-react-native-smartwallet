import type { ComponentProps, FC, PropsWithChildren } from 'react'
import { type GestureResponderEvent, StyleSheet, View } from 'react-native'

import { colors } from '@/shared/config'
import { AnimatedTouchable } from '@/shared/ui/AnimatedTouchable'
import { Typography, type TypographyProps } from '@/shared/ui/Typography'

const styles = StyleSheet.create({
  checkedThumb: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    height: 12,
    width: 12,
  },
  filterRadioButton: {
    alignItems: 'center',
    backgroundColor: colors['white/60'],
    borderRadius: 8,
    boxShadow: `0px 0px 0px 1px ${colors['black/07']} inset`,
    flexDirection: 'row',
    gap: 8,
    height: 44,
    justifyContent: 'space-between',
    paddingEnd: 22,
    paddingStart: 16,
    width: '100%',
  },
  filterRadioButtonChecked: {
    boxShadow: `0px 0px 0px 2px ${colors.primary} inset`,
  },
  radioButton: {
    alignItems: 'center',
    borderColor: colors['gray-400'],
    borderRadius: 100,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  radioButtonChecked: {
    borderColor: colors.primary,
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    overflow: 'hidden',
  },
})

/* -------------------------------------------------------------------------------------------------
 * FilterRadioButtonTip
 * -----------------------------------------------------------------------------------------------*/
type FilterRadioButtonTipProps = TypographyProps

const FilterRadioButtonTip: FC<FilterRadioButtonTipProps> = (props) => <Typography numberOfLines={1} {...props} />

/* -------------------------------------------------------------------------------------------------
 * FilterRadioButtonLabel
 * -----------------------------------------------------------------------------------------------*/
type FilterRadioButtonLabelProps = TypographyProps

const FilterRadioButtonLabel: FC<FilterRadioButtonLabelProps> = (props) => <Typography numberOfLines={1} {...props} />

/* -------------------------------------------------------------------------------------------------
 * FilterRadioButton
 * -----------------------------------------------------------------------------------------------*/
type FilterRadioButtonProps = Omit<ComponentProps<typeof AnimatedTouchable>, 'children'> &
  PropsWithChildren & {
    value: boolean
    onChange?: (value: boolean) => void
  }

const FilterRadioButton: FC<FilterRadioButtonProps> = ({ value, onChange, style, children, onPress, ...props }) => {
  const handlePress = (e: GestureResponderEvent) => {
    onChange?.(!value)
    onPress?.(e)
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[styles.filterRadioButton, value && styles.filterRadioButtonChecked, style]}
      {...props}
    >
      <View style={styles.text}>{children}</View>
      <View style={[styles.radioButton, value && styles.radioButtonChecked]}>
        {value && <View style={styles.checkedThumb} />}
      </View>
    </AnimatedTouchable>
  )
}

/* -----------------------------------------------------------------------------------------------*/

const Root = FilterRadioButton
const Tip = FilterRadioButtonTip
const Label = FilterRadioButtonLabel

export { FilterRadioButton, FilterRadioButtonLabel, Label, Root, Tip }
export type { FilterRadioButtonLabelProps, FilterRadioButtonProps, FilterRadioButtonTipProps }
