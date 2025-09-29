import { getDisplayName, getIsAdmin, getStatus, getThumbnail } from '../lib/attribute-utils'

export class MyGroupPersonalDetailsView {
  static from(attributes: Record<string, unknown>) {
    return new MyGroupPersonalDetailsView(attributes)
  }

  protected constructor(public readonly attributes: Record<string, unknown>) {}

  get displayName() {
    return getDisplayName(this.attributes)
  }

  get thumbnail() {
    return getThumbnail(this.attributes)
  }

  get status() {
    return getStatus(this.attributes)
  }

  get isAdmin() {
    return getIsAdmin(this.attributes)
  }
}
