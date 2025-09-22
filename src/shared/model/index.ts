// Public API for shared/model segment

// API types
export type { PaginatedFetchParams, PaginatedListResponse } from "./api"

// Storage utilities
export {
  clearAll,
  getItem,
  getObjectItem,
  removeItem,
  setItem,
  setObjectItem,
  storage,
} from "./storage"

// MMKV atom utilities
export { makeAtomWithMMKV } from "./mmkv"

// Drawer state
export { drawerIsOpenedAtom } from "./drawer"
