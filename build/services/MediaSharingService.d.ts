import { AgentContext, EventEmitter, MessageHandlerInboundMessage } from '@credo-ts/core';
import { MediaSharingRepository, MediaSharingRecord } from '../repository';
import { ShareMediaMessage, RequestMediaMessage } from '../messages';
import { ShareMediaHandler } from '../handlers';
import { CreateMediaSharingRecordOptions, RequestMediaSharingRecordOptions, ShareMediaSharingRecordOptions } from './MediaSharingServiceOptions';
export declare class MediaSharingService {
    private mediaSharingRepository;
    private eventEmitter;
    constructor(mediaSharingRepository: MediaSharingRepository, eventEmitter: EventEmitter);
    /**
     * Creates a new record
     *
     * @param options
     * @returns
     */
    createRecord(agentContext: AgentContext, options: CreateMediaSharingRecordOptions): Promise<MediaSharingRecord>;
    /**
     * Creates a media share
     * @param options
     * @returns
     */
    createMediaShare(agentContext: AgentContext, options: ShareMediaSharingRecordOptions): Promise<{
        record: MediaSharingRecord;
        message: ShareMediaMessage;
    }>;
    /**
     * Creates a media request
     * @param options
     * @returns
     */
    createMediaRequest(agentContext: AgentContext, options: RequestMediaSharingRecordOptions): Promise<{
        message: RequestMediaMessage;
    }>;
    processShareMedia(messageContext: MessageHandlerInboundMessage<ShareMediaHandler>): Promise<null>;
    /**
     * Retrieve all media sharing records
     *
     * @returns List containing all auth code records
     */
    getAll(agentContext: AgentContext): Promise<MediaSharingRecord[]>;
    /**
     * Retrieve a record by id
     *
     * @param recordId The record id
     * @throws {RecordNotFoundError} If no record is found
     * @return The record
     *
     */
    getById(agentContext: AgentContext, recordId: string): Promise<MediaSharingRecord>;
    /**
     * Find a record by id
     *
     * @param recordId record id
     * @returns The record or null if not found
     */
    findById(agentContext: AgentContext, recordId: string): Promise<MediaSharingRecord | null>;
    /**
     * Delete a record by id
     *
     * @param recordId the record id
     */
    deleteById(agentContext: AgentContext, recordId: string): Promise<void>;
    /**
     * Retrieve a record by thread id
     *
     * @param threadId The thread id
     * @throws {RecordNotFoundError} If no record is found
     * @throws {RecordDuplicateError} If multiple records are found
     * @returns The media sharing record
     */
    findByThreadId(agentContext: AgentContext, threadId: string): Promise<MediaSharingRecord | null>;
    /**
     * Retrieve auth code records by connection id
     *
     * @param connectionId The connection id
     * @param threadId The thread id
     * @throws {RecordNotFoundError} If no record is found
     * @throws {RecordDuplicateError} If multiple records are found
     * @returns The media sharing record
     */
    findAllByConnectionId(agentContext: AgentContext, connectionId: string): Promise<MediaSharingRecord[]>;
    /**
     * Update a record in storage repository, making it persistent
     *
     * @param record
     * @returns
     */
    update(agentContext: AgentContext, record: MediaSharingRecord): Promise<void>;
}
