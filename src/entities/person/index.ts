export type {
  Person,
  PersonsFilter,
  PersonsListFetchParams,
  PersonsPaginatedListFetchParams,
  PersonsPaginatedListResponse,
  ShortPerson,
} from "./model/types"

export { PersonListCard, PersonListSkeleton } from "./ui/PersonListCard"

export { getManagePaginatedPersonsListAtom, getPaginatedPersonsListStateAtom } from "./model/store"
