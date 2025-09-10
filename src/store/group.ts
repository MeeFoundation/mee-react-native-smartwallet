import { defaultGroupFilter, GroupFilter } from "@services/group.service"
import { atomWithDefault } from "jotai/utils"

export const groupFilterAtom = atomWithDefault<GroupFilter>(() => defaultGroupFilter)
