import { AgentMessage, Attachment, AttachmentData, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { uuid } from '@aries-framework/core/build/utils/uuid'
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
      for (const item of options.items) {
        const itemId = item.id ?? uuid()
        this.addAppendedAttachment(
          new Attachment({
            id: itemId,
            filename: item.filename,
            mimeType: item.mimeType,
            byteCount: item.byteCount,
            description: item.description,
            data: new AttachmentData({ links: [item.uri] }),
          })
        )
      }
    }
  }

  @IsOptional()
  @IsString()
  public description?: string

  @IsValidMessageType(ShareMediaMessage.type)
  public readonly type = ShareMediaMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://2060.io/didcomm/media-sharing/0.1/share-media')
}
