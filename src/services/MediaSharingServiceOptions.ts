import { ConnectionRecord } from '@aries-framework/core'
import { MediaSharingRecord, SharedMediaItem } from '../repository'

export interface CreateMediaSharingRecordOptions {
  connectionRecord: ConnectionRecord
  parentThreadId?: string
  description?: string
  items?: SharedMediaItem[]
  metadata?: Record<string, unknown>
}

export interface ShareMediaSharingRecordOptions {
  record: MediaSharingRecord
  parentThreadId?: string
  description?: string
  items?: SharedMediaItem[]
}
