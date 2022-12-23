import { AgentContext, AriesFrameworkError, EventEmitter, MessageHandlerInboundMessage } from '@aries-framework/core'
import { Lifecycle, scoped } from 'tsyringe'

import { MediaSharingEventTypes, MediaSharingStateChangedEvent } from '../MediaSharingEvents'
import { MediaSharingRepository, MediaSharingRecord, SharedMediaItem } from '../repository'
import { ShareMediaMessage } from '../messages'
import { ShareMediaHandler } from '../handlers'
import { MediaSharingRole, MediaSharingState } from '../model'
import { CreateMediaSharingRecordOptions, ShareMediaSharingRecordOptions } from './MediaSharingServiceOptions'

@scoped(Lifecycle.ContainerScoped)
export class MediaSharingService {
  private mediaSharingRepository: MediaSharingRepository
  private eventEmitter: EventEmitter

  public constructor(mediaSharingRepository: MediaSharingRepository, eventEmitter: EventEmitter) {
    this.mediaSharingRepository = mediaSharingRepository
    this.eventEmitter = eventEmitter
  }

  /**
   * Creates a new record
   *
   * @param options
   * @returns
   */
  public async createRecord(agentContext: AgentContext, options: CreateMediaSharingRecordOptions) {
    // Create record
    const record = new MediaSharingRecord({
      connectionId: options.connectionRecord.id,
      parentThreadId: options.parentThreadId,
      role: MediaSharingRole.Sender,
      state: MediaSharingState.Init,
      description: options.description,
      items: options.items,
      metadata: options.metadata,
    })

    await this.mediaSharingRepository.save(agentContext, record)

    this.eventEmitter.emit<MediaSharingStateChangedEvent>(agentContext, {
      type: MediaSharingEventTypes.StateChanged,
      payload: {
        mediaSharingRecord: record,
        previousState: null,
      },
    })

    return record
  }

  /**
   * Creates a media share
   * @param options
   * @returns
   */
  public async createMediaShare(agentContext: AgentContext, options: ShareMediaSharingRecordOptions) {
    const record = options.record
    const previousState = options.record.state

    if (options.description) {
      record.description = options.description
    }

    if (options.items) {
      record.items = options.items
    }

    if (options.parentThreadId) {
      record.parentThreadId = options.parentThreadId
    }

    if (!record.items) {
      throw new AriesFrameworkError('MediaSharingRecord does not contain any item to share')
    }

    // Create message
    const message = new ShareMediaMessage({
      parentThreadId: record.parentThreadId,
      description: record.description,
      items: record.items,
    })

    // Update record
    record.threadId = message.id
    record.state = MediaSharingState.MediaShared

    await this.mediaSharingRepository.update(agentContext, record)

    this.eventEmitter.emit<MediaSharingStateChangedEvent>(agentContext, {
      type: MediaSharingEventTypes.StateChanged,
      payload: {
        mediaSharingRecord: record,
        previousState: previousState,
      },
    })

    return { record, message }
  }

  public async processShareMedia(messageContext: MessageHandlerInboundMessage<ShareMediaHandler>) {
    const { message } = messageContext

    const record = await this.findByThreadId(messageContext.agentContext, message.threadId)

    // Auth record record already exists
    if (record) {
      throw new AriesFrameworkError(`There is already a MediaSharingRecord with thread Id ${message.threadId}`)
    } else {
      const connection = messageContext.assertReadyConnection()

      const items: SharedMediaItem[] = []
      if (message.appendedAttachments) {
        for (const attachment of message.appendedAttachments) {
          if (attachment.data.links && attachment.data.links[0]) {
            items.push({
              uri: attachment.data.links[0],
              id: attachment.id,
              mimeType: attachment.mimeType,
              filename: attachment.filename,
              byteCount: attachment.byteCount,
              description: attachment.description,
            })
          }
        }
      }

      if (items.length === 0) {
        throw new AriesFrameworkError('There are no valid items in MediaSharingRecord')
      }

      // New record
      const record = new MediaSharingRecord({
        connectionId: connection.id,
        threadId: message.id,
        parentThreadId: messageContext.message.thread?.parentThreadId,
        state: MediaSharingState.MediaShared,
        role: MediaSharingRole.Receiver,
        items,
        description: message.description,
      })

      await this.mediaSharingRepository.save(messageContext.agentContext, record)

      this.eventEmitter.emit<MediaSharingStateChangedEvent>(messageContext.agentContext, {
        type: MediaSharingEventTypes.StateChanged,
        payload: {
          mediaSharingRecord: record,
          previousState: null,
        },
      })
    }

    return record
  }

  /**
   * Retrieve all auth code records
   *
   * @returns List containing all auth code records
   */
  public getAll(agentContext: AgentContext): Promise<MediaSharingRecord[]> {
    return this.mediaSharingRepository.getAll(agentContext)
  }

  /**
   * Retrieve a record by id
   *
   * @param recordId The record id
   * @throws {RecordNotFoundError} If no record is found
   * @return The record
   *
   */
  public getById(agentContext: AgentContext, recordId: string): Promise<MediaSharingRecord> {
    return this.mediaSharingRepository.getById(agentContext, recordId)
  }

  /**
   * Find a record by id
   *
   * @param recordId record id
   * @returns The record or null if not found
   */
  public findById(agentContext: AgentContext, recordId: string): Promise<MediaSharingRecord | null> {
    return this.mediaSharingRepository.findById(agentContext, recordId)
  }

  /**
   * Delete a record by id
   *
   * @param recordId the record id
   */
  public async deleteById(agentContext: AgentContext, recordId: string) {
    const mediaSharingRecord = await this.getById(agentContext, recordId)
    return this.mediaSharingRepository.delete(agentContext, mediaSharingRecord)
  }

  /**
   * Retrieve a record by thread id
   *
   * @param threadId The thread id
   * @throws {RecordNotFoundError} If no record is found
   * @throws {RecordDuplicateError} If multiple records are found
   * @returns The media sharing record
   */
  public async findByThreadId(agentContext: AgentContext, threadId: string): Promise<MediaSharingRecord | null> {
    return this.mediaSharingRepository.findSingleByQuery(agentContext, {
      threadId,
    })
  }

  /**
   * Retrieve auth code records by connection id
   *
   * @param connectionId The connection id
   * @param threadId The thread id
   * @throws {RecordNotFoundError} If no record is found
   * @throws {RecordDuplicateError} If multiple records are found
   * @returns The media sharing record
   */
  public async findAllByConnectionId(agentContext: AgentContext, connectionId: string): Promise<MediaSharingRecord[]> {
    return this.mediaSharingRepository.findByQuery(agentContext, {
      connectionId,
    })
  }

  /**
   * Update a record in storage repository, making it persistent
   *
   * @param record
   * @returns
   */
  public async update(agentContext: AgentContext, record: MediaSharingRecord) {
    return await this.mediaSharingRepository.update(agentContext, record)
  }
}
