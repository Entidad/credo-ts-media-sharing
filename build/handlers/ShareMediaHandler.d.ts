import { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/core';
import { ShareMediaMessage } from '../messages/ShareMediaMessage';
import { MediaSharingService } from '../services';
export declare class ShareMediaHandler implements MessageHandler {
    supportedMessages: (typeof ShareMediaMessage)[];
    private mediaSharingService;
    constructor(mediaSharingService: MediaSharingService);
    handle(inboundMessage: MessageHandlerInboundMessage<ShareMediaHandler>): Promise<void>;
}
