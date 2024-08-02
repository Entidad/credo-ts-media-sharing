"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMediaHandler = void 0;
const messages_1 = require("../messages");
class RequestMediaHandler {
    constructor(mediaSharingService) {
        this.supportedMessages = [messages_1.RequestMediaMessage];
        this.mediaSharingService = mediaSharingService;
    }
    async handle(inboundMessage) {
        inboundMessage.assertReadyConnection();
        // Nothing to do internally. Will be handled by the controller
    }
}
exports.RequestMediaHandler = RequestMediaHandler;
//# sourceMappingURL=RequestMediaHandler.js.map