import { atom } from 'jotai'
import { atomFamily, atomWithDefault } from 'jotai/utils'

import { connectionService } from './service'
import type { Connection } from './types'

export const ConnectionsStore = atomWithDefault<Connection[] | Promise<Connection[]>>(
  async () => await connectionService.getConnections(),
)

export const ConnectionDetails = atomFamily((id: string) =>
  atom(
    async (get) => {
      const connections = await get(ConnectionsStore)
      const connection = connections.find((c) => c.id === id)
      if (!connection) {
        console.error(`Connection with id ${id} not found`)
      }
      // TODO Remove !
      // biome-ignore lint/style/noNonNullAssertion: remove this
      return connection!
    },
    async (get, set, connection: Connection) => {
      const connections = await get(ConnectionsStore)
      const updatedConnections = connections.map((c) => (c.id === connection.id ? connection : c))
      set(ConnectionsStore, updatedConnections)
    },
  ),
)
