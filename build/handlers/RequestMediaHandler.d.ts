import { MessageHandler, MessageHandlerInboundMessage } from '@credo-ts/core';
import { MediaSharingService } from '../services';
import { RequestMediaMessage } from '../messages';
export declare class RequestMediaHandler implements MessageHandler {
    supportedMessages: (typeof RequestMediaMessage)[];
    private mediaSharingService;
    constructor(mediaSharingService: MediaSharingService);
    handle(inboundMessage: MessageHandlerInboundMessage<RequestMediaHandler>): Promise<void>;
}
