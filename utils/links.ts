import type { Connection } from "@/models/connection"
import type { Group } from "@/models/group"
import type { O } from "ts-toolbelt"

/* -------------------------------------------------------------------------------------------------
 * Home screens
 * -----------------------------------------------------------------------------------------------*/
export const getHomeScreenLink = () => "/" as const

/* -------------------------------------------------------------------------------------------------
 * Groups screens
 * -----------------------------------------------------------------------------------------------*/
export const getGroupsScreenLink = () => "/" as const
export const getGroupChatScreenLink = (group: O.AtLeast<Group, "id">) =>
  `/groups/${group.id}/chat` as const
export const getGroupMemebersScreenLink = (group: O.AtLeast<Group, "id">) =>
  `/groups/${group.id}/members` as const
export const getGroupMyInfoScreenLink = (group: O.AtLeast<Group, "id">) =>
  `/groups/${group.id}/my-info` as const

/**
 * Chat screen is the default screen for a group
 */
export const getGroupScreenLink = getGroupChatScreenLink

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
