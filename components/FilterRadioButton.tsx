import { AnimatedTouchable } from "@/components/AnimatedTouchable"
import { Typography, type TypographyProps } from "@/components/Typography"
import { colors } from "@/constants/colors"
import { type ComponentProps, type FC, type PropsWithChildren } from "react"
import { type GestureResponderEvent, StyleSheet, View } from "react-native"

const styles = StyleSheet.create({
  filterRadioButton: {
    height: 44,
    backgroundColor: colors["white/60"],
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    gap: 8,
    boxShadow: `0px 0px 0px 1px ${colors["black/07"]} inset`,
    paddingStart: 16,
    paddingEnd: 22,
  },
  filterRadioButtonChecked: {
    boxShadow: `0px 0px 0px 2px ${colors.primary} inset`,
  },
  text: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    overflow: "hidden",
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 100,
    borderColor: colors["gray-400"],
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonChecked: {
    borderColor: colors.primary,
  },
  checkedThumb: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
})

/* -------------------------------------------------------------------------------------------------
 * FilterRadioButtonTip
 * -----------------------------------------------------------------------------------------------*/
type FilterRadioButtonTipProps = TypographyProps

const FilterRadioButtonTip: FC<FilterRadioButtonTipProps> = (props) => (
  <Typography numberOfLines={1} {...props} />
)

/* -------------------------------------------------------------------------------------------------
 * FilterRadioButtonLabel
 * -----------------------------------------------------------------------------------------------*/
type FilterRadioButtonLabelProps = TypographyProps

const FilterRadioButtonLabel: FC<FilterRadioButtonLabelProps> = (props) => (
  <Typography numberOfLines={1} {...props} />
)

/* -------------------------------------------------------------------------------------------------
 * FilterRadioButton
 * -----------------------------------------------------------------------------------------------*/
type FilterRadioButtonProps = Omit<ComponentProps<typeof AnimatedTouchable>, "children"> &
  PropsWithChildren & {
    value: boolean
    onChange?: (value: boolean) => void
  }

const FilterRadioButton: FC<FilterRadioButtonProps> = ({
  value,
  onChange,
  style,
  children,
  onPress,
  ...props
}) => {
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
