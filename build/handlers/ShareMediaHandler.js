"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareMediaHandler = void 0;
const ShareMediaMessage_1 = require("../messages/ShareMediaMessage");
class ShareMediaHandler {
    constructor(mediaSharingService) {
        this.supportedMessages = [ShareMediaMessage_1.ShareMediaMessage];
        this.mediaSharingService = mediaSharingService;
    }
    async handle(inboundMessage) {
        inboundMessage.assertReadyConnection();
        await this.mediaSharingService.processShareMedia(inboundMessage);
    }
}
exports.ShareMediaHandler = ShareMediaHandler;
//# sourceMappingURL=ShareMediaHandler.js.map