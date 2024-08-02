import { BaseRecord } from '@credo-ts/core';
import { MediaSharingRole, MediaSharingState } from '../model';
export interface CipheringInfo {
    algorithm: string;
    parameters: Record<string, unknown>;
}
export interface SharedMediaItemOptions {
    id?: string;
    uri: string;
    mimeType: string;
    description?: string;
    byteCount?: number;
    fileName?: string;
    ciphering?: CipheringInfo;
    metadata?: Record<string, unknown>;
}
export declare class SharedMediaItem {
    id: string;
    uri: string;
    mimeType: string;
    description?: string;
    byteCount?: number;
    fileName?: string;
    ciphering?: CipheringInfo;
    metadata?: Record<string, unknown>;
    constructor(options: SharedMediaItemOptions);
}
export interface MediaSharingStorageProps {
    id?: string;
    createdAt?: Date;
    connectionId: string;
    threadId?: string;
    parentThreadId?: string;
    role: MediaSharingRole;
    state: MediaSharingState;
    description?: string;
    items?: SharedMediaItem[];
    metadata?: Record<string, unknown>;
    sentTime?: Date;
}
export declare class MediaSharingRecord extends BaseRecord<any, any, any> {
    connectionId: string;
    threadId?: string;
    parentThreadId?: string;
    role: MediaSharingRole;
    state: MediaSharingState;
    description?: string;
    sentTime?: Date;
    items?: SharedMediaItem[];
    static readonly type = "MediaSharingRecord";
    readonly type = "MediaSharingRecord";
    constructor(props: MediaSharingStorageProps);
    getTags(): any;
    assertRole(expectedRole: MediaSharingRole): void;
    assertState(expectedStates: MediaSharingState | MediaSharingState[]): void;
}
