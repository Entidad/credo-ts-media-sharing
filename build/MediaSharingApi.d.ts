import { AgentContext, ConnectionService, MessageSender } from '@credo-ts/core';
import { MediaSharingRecord, SharedMediaItem, SharedMediaItemOptions } from './repository';
import { MediaSharingService } from './services';
export interface MediaSharingCreateOptions {
    connectionId: string;
    parentThreadId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
    items?: SharedMediaItem[];
}
export interface MediaSharingShareOptions {
    recordId: string;
    parentThreadId?: string;
    description?: string;
    items?: SharedMediaItemOptions[];
}
export interface MediaSharingRequestOptions {
    connectionId: string;
    parentThreadId?: string;
    description?: string;
    itemIds: string[];
}
export declare class MediaSharingApi {
    private messageSender;
    private mediaSharingService;
    private connectionService;
    private agentContext;
    constructor(messageSender: MessageSender, mediaSharingService: MediaSharingService, connectionService: ConnectionService, agentContext: AgentContext);
    /**
     * Sender role: create a new shared media record (no actual message will be sent)
     *
     */
    create(options: MediaSharingCreateOptions): Promise<MediaSharingRecord>;
    /**
     * Sender role: share media, providing actual file description details
     */
    share(options: MediaSharingShareOptions): Promise<MediaSharingRecord>;
    /**
     * Receiver role: request media
     */
    request(options: MediaSharingRequestOptions): Promise<void>;
    setMetadata(recordId: string, key: string, value: unknown): Promise<void>;
    /**
     * Retrieve all records
     *
     * @returns List containing all records
     */
    getAll(): Promise<MediaSharingRecord[]>;
    /**
     * Find a record by id
     *
     * @param recordId the record id
     * @returns  the record or null if not found
     */
    findById(recordId: string): Promise<MediaSharingRecord | null>;
    /**
     * Find a record by thread id
     *
     * @param recordId the record id
     * @returns  the record or null if not found
     */
    findByThreadId(recordId: string): Promise<MediaSharingRecord | null>;
}
