import { AgentMessage } from '@credo-ts/core';
export interface RequestMediaMessageOptions {
    id?: string;
    threadId?: string;
    parentThreadId?: string;
    sentTime?: Date;
    description?: string;
    itemIds: string[];
}
export declare class RequestMediaMessage extends AgentMessage {
    constructor(options?: RequestMediaMessageOptions);
    description?: string;
    sentTime: Date;
    itemIds: string[];
    readonly type: string;
    static readonly type: import("@credo-ts/core/build/utils/messageType").ParsedMessageType;
}
