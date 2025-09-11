import { AppButton } from "@components/AppButton"
import * as FilterRadioButton from "@components/FilterRadioButton"
import { Label } from "@components/Label"
import { Group, GroupFilter } from "@services/group.service"
import { colors } from "@utils/theme"
import { isEqual } from "lodash-es"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"

const styles = StyleSheet.create({
  container: { gap: 8 },
})
/* -------------------------------------------------------------------------------------------------
 * Groups
 * -----------------------------------------------------------------------------------------------*/
type FilterGroupsProps = {
  value: GroupFilter
  groups: Group[]

  onSubmit: (value: GroupFilter) => GroupFilter | Promise<GroupFilter>
  onChange?: (value: GroupFilter) => void
  onSuccess?: (value: GroupFilter) => void
}

const FilterGroups: FC<FilterGroupsProps> = ({ value, onSubmit, onSuccess, onChange, groups }) => {
  const [currentValue, setCurrentValue] = useState(value)

  /**
   * React on change of value prop
   */
  useEffect(() => {
    if (!isEqual(currentValue, value)) {
      setCurrentValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- react only on props changed
  }, [value])

  const activeCount = useMemo(
    () => groups.filter((group) => group.status === "active").length,
    [groups],
  )

  const archivedCount = useMemo(
    () => groups.filter((group) => group.status === "archived").length,
    [groups],
  )

  const updateActive = useCallback(
    (active: boolean) => {
      const nextValue: GroupFilter = { ...currentValue, status: active ? "active" : null }
      onChange?.(nextValue)
      setCurrentValue(nextValue)
    },
    [currentValue, onChange],
  )

  const updateArchived = useCallback(
    (archived: boolean) => {
      const nextValue: GroupFilter = { ...currentValue, status: archived ? "archived" : null }
      onChange?.(nextValue)
      setCurrentValue(nextValue)
    },
    [currentValue, onChange],
  )

  const handleSubmit = useCallback(() => {
    const fn = async () => {
      await onSubmit(currentValue)
      onSuccess?.(currentValue)
    }

    // TODO add error handling
    fn().catch((err) => {
      console.error("error submitting groups", err)
    })
  }, [currentValue, onSubmit, onSuccess])

  return (
    <>
      <View style={styles.container}>
        <Label>Group status</Label>
        <FilterRadioButton.Root value={currentValue.status === "active"} onChange={updateActive}>
          <FilterRadioButton.Label>Active</FilterRadioButton.Label>
          <FilterRadioButton.Tip style={{ color: colors["gray-600"] }}>
            ({activeCount})
          </FilterRadioButton.Tip>
        </FilterRadioButton.Root>

        <FilterRadioButton.Root
          value={currentValue.status === "archived"}
          onChange={updateArchived}
        >
          <FilterRadioButton.Label>Archived</FilterRadioButton.Label>
          <FilterRadioButton.Tip style={{ color: colors["gray-600"] }}>
            ({archivedCount})
          </FilterRadioButton.Tip>
        </FilterRadioButton.Root>
      </View>

      <AppButton fullWidth={true} text="Apply Filters" onPress={handleSubmit} />
    </>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { FilterGroups }
export type { FilterGroupsProps }
