import { myGroupPersonalDetailsData } from './mock/my-group-personal-details-data'

export const getMyGroupPersonalDetails = async (_groupId: string): Promise<object> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return myGroupPersonalDetailsData
}
