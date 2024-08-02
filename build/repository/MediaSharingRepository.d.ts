import { EventEmitter, Repository, StorageService } from '@credo-ts/core';
import { MediaSharingRecord } from './MediaSharingRecord';
export declare class MediaSharingRepository extends Repository<MediaSharingRecord> {
    constructor(storageService: StorageService<MediaSharingRecord>, eventEmitter: EventEmitter);
}
