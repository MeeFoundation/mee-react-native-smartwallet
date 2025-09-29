import { ShortGroupView } from './short-group.view'
import type { Group, ShortGroup } from './types'

export class GroupView extends ShortGroupView {
  static from(group: Group) {
    return new GroupView(group)
  }

  private constructor(public readonly group: ShortGroup) {
    super(group)
  }
}
