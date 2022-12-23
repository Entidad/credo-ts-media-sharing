import { v4 as uuid } from 'uuid'
import { AriesFrameworkError, BaseRecord } from '@aries-framework/core'
import { MediaSharingRole, MediaSharingState } from '../model'

export interface SharedMediaItem {
  id?: string
  mimeType?: string
  filename?: string
  byteCount?: number
  description?: string
  uri: string
}

export interface MediaSharingStorageProps {
  id?: string
  createdAt?: Date
  connectionId: string
  threadId?: string
  parentThreadId?: string
  role: MediaSharingRole
  state: MediaSharingState
  description?: string
  items?: SharedMediaItem[]
  metadata?: Record<string, unknown>
}

export class MediaSharingRecord extends BaseRecord {
  public connectionId!: string
  public threadId?: string
  public parentThreadId?: string
  public role!: MediaSharingRole
  public state!: MediaSharingState
  public description?: string
  public items?: SharedMediaItem[]

  public static readonly type = 'MediaSharingRecord'
  public readonly type = MediaSharingRecord.type

  public constructor(props: MediaSharingStorageProps) {
    super()
    if (props) {
      this.id = props.id ?? uuid()
      this.createdAt = props.createdAt ?? new Date()
      this.role = props.role
      this.state = props.state
      this.connectionId = props.connectionId
      this.threadId = props.threadId
      this.parentThreadId = props.parentThreadId
      this.description = props.description
      this.items = props.items?.map((item) => ({ ...item, id: item.id ?? uuid() })) ?? []
      if (props.metadata) {
        Object.keys(props.metadata).forEach((key) => {
          this.metadata.set(key, props.metadata?.[key])
        })
      }
    }
  }

  public getTags() {
    return {
      ...this._tags,
      threadId: this.threadId,
      parentThreadId: this.parentThreadId,
      connectionId: this.connectionId,
      role: this.role,
      state: this.state,
    }
  }

  public assertRole(expectedRole: MediaSharingRole) {
    if (this.role !== expectedRole) {
      throw new AriesFrameworkError(
        `Media sharing record has invalid role ${this.role}. Expected role ${expectedRole}.`
      )
    }
  }

  public assertState(expectedStates: MediaSharingState | MediaSharingState[]) {
    if (!Array.isArray(expectedStates)) {
      expectedStates = [expectedStates]
    }

    if (!expectedStates.includes(this.state)) {
      throw new Error(
        `Auth code record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`
      )
    }
  }
}
