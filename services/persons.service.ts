import type { IndexPaginationRequest, IndexPaginationResponse } from "@/models/api"
import type { Connection } from "@/models/connection"
import type { Person } from "@/models/person"
import { mockConnections } from "@/services/mockData/connections"
import { assertUnreachable } from "@/utils/assert-unreachable"

export type PersonsFilter = {
  connectionStatus?: Connection["status"] | null
  has?: ("email" | "password" | "phone" | "payment_details")[]
}

export type PersonsParams = {
  filter?: PersonsFilter
}

export type PersonsIndexPaginationRequest = IndexPaginationRequest & PersonsParams

export type PersonsIndexPaginatedResponse = IndexPaginationResponse<Person>

export const defaultPersonsFilter: PersonsFilter = {
  connectionStatus: "active",
  has: [],
}

export const emptyPersonsFilter: PersonsFilter = {
  connectionStatus: null,
  has: [],
}

export const filterPersons = (persons: Connection[], { filter }: PersonsParams): Connection[] => {
  if (!filter) return persons

  const filterByConnectionStatus = (person: Connection) =>
    !filter.connectionStatus ? true : person.status === filter.connectionStatus

  const filterByHas = (person: Connection) => {
    if (!filter.has) return true

    return filter.has.every((c) => {
      switch (c) {
        case "email":
          return !!person.sharedInfo.email

        case "phone":
          return person.sharedInfo.phone

        case "password":
          return person.sharedInfo.passwords?.length

        case "payment_details":
          return person.sharedInfo.paymentDetails?.length

        default:
          assertUnreachable(c)
          return false
      }
    })
  }

  return persons.filter(filterByConnectionStatus).filter(filterByHas)
}

class PersonsService {
  async getConnectionDetails(id: string): Promise<Connection> {
    const connection = mockConnections.find((c) => c.id === id)

    if (!connection) {
      throw new Error("Person not found")
    }

    return await Promise.resolve(connection)
  }

  async getPersons(params: PersonsIndexPaginationRequest): Promise<PersonsIndexPaginatedResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const filteredPersons = filterPersons(mockConnections, { filter: params.filter })

    const response = {
      items: filteredPersons.slice(params.startIndex, params.startIndex + params.limit),
      nextIndex:
        filteredPersons.length > params.startIndex + params.limit
          ? params.startIndex + params.limit
          : null,
      totalCount: filteredPersons.length,
    }

    return await Promise.resolve(response)
  }
}

export const personsService = new PersonsService()
