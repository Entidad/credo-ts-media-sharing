import {
  AgentContext,
  ConnectionService,
  injectable,
  MessageSender,
  OutboundMessageContext,
} from '@aries-framework/core'
import { ShareMediaHandler } from './handlers'
import { MediaSharingRecord, SharedMediaItem, SharedMediaItemOptions } from './repository'
import { MediaSharingService } from './services'

export interface MediaSharingCreateOptions {
  connectionId: string
  parentThreadId?: string
  description?: string
  metadata?: Record<string, unknown>
  items?: SharedMediaItem[]
}

export interface MediaSharingShareOptions {
  recordId: string
  parentThreadId?: string
  description?: string
  items?: SharedMediaItemOptions[]
}

@injectable()
export class MediaSharingApi {
  private messageSender: MessageSender
  private mediaSharingService: MediaSharingService
  private connectionService: ConnectionService
  private agentContext: AgentContext

  public constructor(
    messageSender: MessageSender,
    mediaSharingService: MediaSharingService,
    connectionService: ConnectionService,
    agentContext: AgentContext
  ) {
    this.messageSender = messageSender
    this.mediaSharingService = mediaSharingService
    this.connectionService = connectionService
    this.agentContext = agentContext

    this.agentContext.dependencyManager.registerMessageHandlers([new ShareMediaHandler(this.mediaSharingService)])
  }

  /**
   * Sender role: create a new shared media record (no actual message will be sent)
   *
   */
  public async create(options: MediaSharingCreateOptions) {
    const connection = await this.connectionService.getById(this.agentContext, options.connectionId)

    const record = await this.mediaSharingService.createRecord(this.agentContext, {
      connectionRecord: connection,
      parentThreadId: options.parentThreadId,
      items: options.items,
      description: options.description,
      metadata: options.metadata,
    })

    return record
  }

  /**
   * Sender role: share media, providing actual file description details
   */
  public async share(options: MediaSharingShareOptions) {
    const record = await this.mediaSharingService.getById(this.agentContext, options.recordId)
    const connection = await this.connectionService.getById(this.agentContext, record.connectionId)

    const { message: payload } = await this.mediaSharingService.createMediaShare(this.agentContext, {
      record,
      items: options.items?.map((item) => new SharedMediaItem(item)),
      description: options.description,
      parentThreadId: options.parentThreadId,
    })

    await this.messageSender.sendMessage(
      new OutboundMessageContext(payload, {
        agentContext: this.agentContext,
        connection,
        associatedRecord: record,
      })
    )

    return record
  }

  public async setMetadata(recordId: string, key: string, value: unknown) {
    const record = await this.mediaSharingService.getById(this.agentContext, recordId)
    record.metadata.set(key, value)
    await this.mediaSharingService.update(this.agentContext, record)
  }

  /**
   * Retrieve all records
   *
   * @returns List containing all records
   */
  public getAll(): Promise<MediaSharingRecord[]> {
    return this.mediaSharingService.getAll(this.agentContext)
  }

  /**
   * Find a record by id
   *
   * @param recordId the record id
   * @returns  the record or null if not found
   */
  public findById(recordId: string): Promise<MediaSharingRecord | null> {
    return this.mediaSharingService.findById(this.agentContext, recordId)
  }

  /**
   * Find a record by thread id
   *
   * @param recordId the record id
   * @returns  the record or null if not found
   */
  public findByThreadId(recordId: string): Promise<MediaSharingRecord | null> {
    return this.mediaSharingService.findByThreadId(this.agentContext, recordId)
  }
}
