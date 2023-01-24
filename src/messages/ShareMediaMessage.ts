import { AgentMessage, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { SharedMediaItem } from '../repository'

export interface ShareMediaMessageOptions {
  id?: string
  threadId?: string
  parentThreadId?: string
  description?: string
  items: SharedMediaItem[]
}

export class ShareMediaMessage extends AgentMessage {
  public constructor(options?: ShareMediaMessageOptions) {
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

      this.description = options.description
      this.items = options.items
    }
  }

  @IsOptional()
  @IsString()
  public description?: string

  @Type(() => SharedMediaItem)
  public items!: SharedMediaItem[]

  @IsValidMessageType(ShareMediaMessage.type)
  public readonly type = ShareMediaMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://2060.io/didcomm/media-sharing/0.1/share-media')
}
