import { atomFamily, atomWithDefault } from 'jotai/utils'

import { getGroupRequestedAttributesSchema } from '../api/get-group-requested-attributes-schema'

export const getGroupRequestedAttributesSchemaAtom = atomFamily((groupId: string) =>
  atomWithDefault(() => getGroupRequestedAttributesSchema(groupId)),
)
