import { AgentMessage } from '@credo-ts/core';
import { CipheringInfo, SharedMediaItem } from '../repository';
interface SharedMediaItemDescriptorOptions {
    id: string;
    attachmentId: string;
    description?: string;
    ciphering?: CipheringInfo;
    metadata?: Record<string, unknown>;
}
declare class SharedMediaItemDescriptor {
    id: string;
    attachmentId: string;
    ciphering?: CipheringInfo;
    metadata?: Record<string, unknown>;
    constructor(options: SharedMediaItemDescriptorOptions);
}
export interface ShareMediaMessageOptions {
    id?: string;
    threadId?: string;
    parentThreadId?: string;
    sentTime?: Date;
    description?: string;
    items: SharedMediaItem[];
}
export declare class ShareMediaMessage extends AgentMessage {
    constructor(options?: ShareMediaMessageOptions);
    description?: string;
    sentTime: Date;
    items: SharedMediaItemDescriptor[];
    readonly type: string;
    static readonly type: import("@credo-ts/core").ParsedMessageType;
}
export {};
