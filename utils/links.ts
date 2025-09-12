import type { Connection } from "@/services/core.service"
import type { Group } from "@/services/group.service"
import type { O } from "ts-toolbelt"

/* -------------------------------------------------------------------------------------------------
 * Home screens
 * -----------------------------------------------------------------------------------------------*/
export const getHomeScreenLink = () => "/" as const

/* -------------------------------------------------------------------------------------------------
 * Groups screens
 * -----------------------------------------------------------------------------------------------*/
export const getGroupsScreenLink = () => "/" as const
export const getGroupScreenLink = (group: O.AtLeast<Group, "id">) => `/groups/${group.id}` as const

/* -------------------------------------------------------------------------------------------------
 * People screen
 * -----------------------------------------------------------------------------------------------*/
export const getPeopleScreenLink = () => "/people" as const

/* -------------------------------------------------------------------------------------------------
 * Manage contacts
 * -----------------------------------------------------------------------------------------------*/
// TODO Check whether there must be a connection?
export const getManageContactScreenLink = (contact: O.AtLeast<Connection, "id">) =>
  `/manage-contact/${contact.id}` as const

/* -------------------------------------------------------------------------------------------------
 * Manage connections
 * -----------------------------------------------------------------------------------------------*/
export const getManageConnectionScreenLink = (connection: O.AtLeast<Connection, "id">) =>
  `/manage-connection/${connection.id}` as const

/* -------------------------------------------------------------------------------------------------
 * Welcome screen
 * -----------------------------------------------------------------------------------------------*/
export const getWelcomeScreenLink = () => "/welcome" as const

/* -------------------------------------------------------------------------------------------------
 * Settings screen
 * -----------------------------------------------------------------------------------------------*/
export const getSettingsScreenLink = () => "/settings" as const
