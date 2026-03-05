import { getGroupHasChat, getGroupKnownStatus, getGroupName, getGroupThumbnail } from '../lib/attribute-utils'
import type { ShortGroup } from './types'

export class ShortGroupView {
  static from(group: ShortGroup) {
    return new ShortGroupView(group)
  }

  protected constructor(public readonly group: ShortGroup) {}

  get id() {
    return this.group.id
  }

  get name(): string {
    // FIXME either translate or make it optional
    return getGroupName(this.group) ?? 'Untitled'
  }

  get status() {
    return getGroupKnownStatus(this.group)
  }

  get thumbnail() {
    return getGroupThumbnail(this.group)
  }

  get connections() {
    return this.group.connections
  }

  get hasChat() {
    return getGroupHasChat(this.group)
  }
}
