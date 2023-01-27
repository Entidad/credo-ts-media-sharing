import { v4 as uuid } from 'uuid'
import { AriesFrameworkError, Attachment, AttachmentData, BaseRecord } from '@aries-framework/core'
import { MediaSharingRole, MediaSharingState } from '../model'
import { AttachmentOptions } from '@aries-framework/core/build/decorators/attachment/Attachment'
import { Exclude, Type } from 'class-transformer'

export interface CipheringInfo {
  algorithm: string
  parameters: Record<string, unknown>
}

export interface SharedMediaItemOptions extends Omit<AttachmentOptions, 'data'> {
  uri: string
  ciphering?: CipheringInfo
  metadata?: Record<string, unknown>
}

export class SharedMediaItem extends Attachment {
  @Exclude()
  public get uri() {
    return this.data.links ? this.data.links[0] : undefined
  }

  public ciphering?: CipheringInfo
  public metadata?: Record<string, unknown>

  public constructor(options: SharedMediaItemOptions) {
    super({ ...options, data: new AttachmentData({ links: [options?.uri] }) })
    if (options) {
      this.ciphering = options.ciphering
      this.metadata = options.metadata
    }
  }
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

  @Type(() => SharedMediaItem)
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
      this.items = props.items ?? []
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
        `Media sharing record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`
      )
    }
  }
}
