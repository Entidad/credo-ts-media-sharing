import { AgentMessage, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { DateParser } from '@aries-framework/core/build/utils/transformers'
import { Expose, Transform } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'
import { CipheringInfo } from '../repository'

interface SharedMediaItemDescriptorOptions {
  id: string
  attachmentId: string
  description?: string
  ciphering?: CipheringInfo
  metadata?: Record<string, unknown>
}

class SharedMediaItemDescriptor {
  @Expose({ name: '@id' })
  public id!: string

  @Expose({ name: 'attachment_id' })
  public attachmentId!: string

  public ciphering?: CipheringInfo

  public metadata?: Record<string, unknown>

  public constructor(options: SharedMediaItemDescriptorOptions) {
    if (options) {
      this.id = options.id
      this.attachmentId = options.attachmentId
      this.ciphering = options.ciphering
      this.metadata = options.metadata
    }
  }
}

export interface RequestMediaMessageOptions {
  id?: string
  threadId?: string
  parentThreadId?: string
  sentTime?: Date
  description?: string
  itemIds: string[]
}

export class RequestMediaMessage extends AgentMessage {
  public constructor(options?: RequestMediaMessageOptions) {
    super()

    if (options) {
      this.id = options.id ?? this.generateId()

      if (options.threadId) {
        this.setThread({ threadId: options.threadId })
      }

      if (options.parentThreadId) {
        this.setThread({
          ...this.thread,
          parentThreadId: options.parentThreadId,
        })
      }

      this.sentTime = options.sentTime || new Date()
      this.description = options.description

      this.itemIds = options.itemIds
    }
  }

  @IsOptional()
  @IsString()
  public description?: string

  @Expose({ name: 'sent_time' })
  @Transform(({ value }) => DateParser(value))
  @IsDate()
  public sentTime!: Date

  public itemIds!: string[]

  @IsValidMessageType(RequestMediaMessage.type)
  public readonly type = RequestMediaMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://didcomm.org/media-sharing/1.0/request-media')
}
