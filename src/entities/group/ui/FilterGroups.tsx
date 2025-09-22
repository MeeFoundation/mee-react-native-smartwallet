import { colors } from "@/shared/config"
import { usePaginatedState } from "@/shared/lib/paginated-list"
import { AppButton } from "@/shared/ui/AppButton"
import * as FilterRadioButton from "@/shared/ui/FilterRadioButton"
import { Label } from "@/shared/ui/Label"
import { isEqual } from "lodash-es"
import { type FC, useCallback, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { getManagePaginatedGroupsListAtom, getPaginatedGroupsListStateAtom } from "../model/store"
import type { GroupsFilter, GroupsListFetchParams } from "../model/types"

const styles = StyleSheet.create({
  container: { gap: 8 },
})

/* -------------------------------------------------------------------------------------------------
 * Groups
 * -----------------------------------------------------------------------------------------------*/
type FilterGroupsProps = {
  value: GroupsFilter

  onSubmit: (value: GroupsFilter) => GroupsFilter | Promise<GroupsFilter>
  onChange?: (value: GroupsFilter) => void
  onSuccess?: (value: GroupsFilter) => void
}

const activeFetchParams: GroupsListFetchParams = { filter: { status: "active" } }
const archivedFetchParams: GroupsListFetchParams = { filter: { status: "archived" } }

const FilterGroups: FC<FilterGroupsProps> = ({ value, onSubmit, onSuccess, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value)

  const [activeGroupsListState] = usePaginatedState(
    activeFetchParams,
    getPaginatedGroupsListStateAtom,
    getManagePaginatedGroupsListAtom,
  )

  const [archivedGroupsListState] = usePaginatedState(
    archivedFetchParams,
    getPaginatedGroupsListStateAtom,
    getManagePaginatedGroupsListAtom,
  )

  /**
   * React on change of value prop
   */
  useEffect(() => {
    if (!isEqual(currentValue, value)) {
      setCurrentValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- react only on props changed
  }, [value])

  const activeCount = activeGroupsListState.data?.items.length
  const archivedCount = archivedGroupsListState.data?.items.length

  const updateActive = useCallback(
    (active: boolean) => {
      const nextValue: GroupsFilter = { ...currentValue, status: active ? "active" : null }
      onChange?.(nextValue)
      setCurrentValue(nextValue)
    },
    [currentValue, onChange],
  )

  const updateArchived = useCallback(
    (archived: boolean) => {
      const nextValue: GroupsFilter = { ...currentValue, status: archived ? "archived" : null }
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
