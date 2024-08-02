"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareMediaMessage = void 0;
const core_1 = require("@credo-ts/core");
const transformers_1 = require("@credo-ts/core/build/utils/transformers");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SharedMediaItemDescriptor {
    constructor(options) {
        if (options) {
            this.id = options.id;
            this.attachmentId = options.attachmentId;
            this.ciphering = options.ciphering;
            this.metadata = options.metadata;
        }
    }
}
__decorate([
    (0, class_transformer_1.Expose)({ name: '@id' }),
    __metadata("design:type", String)
], SharedMediaItemDescriptor.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'attachment_id' }),
    __metadata("design:type", String)
], SharedMediaItemDescriptor.prototype, "attachmentId", void 0);
class ShareMediaMessage extends core_1.AgentMessage {
    constructor(options) {
        var _a;
        super();
        this.type = ShareMediaMessage.type.messageTypeUri;
        if (options) {
            this.id = (_a = options.id) !== null && _a !== void 0 ? _a : this.generateId();
            if (options.threadId) {
                this.setThread({ threadId: options.threadId });
            }
            if (options.parentThreadId) {
                this.setThread(Object.assign(Object.assign({}, this.thread), { parentThreadId: options.parentThreadId }));
            }
            this.sentTime = options.sentTime || new Date();
            this.description = options.description;
            // Assign an attachment per item using index as id
            this.items = [];
            for (var i = 0; i < options.items.length; i++) {
                const item = options.items[i];
                this.addAppendedAttachment(new core_1.Attachment({
                    id: i.toString(),
                    data: { links: [item.uri] },
                    byteCount: item.byteCount,
                    filename: item.fileName,
                    description: item.description,
                    mimeType: item.mimeType,
                }));
                this.items.push({
                    id: item.id,
                    attachmentId: i.toString(),
                    ciphering: item.ciphering,
                    metadata: item.metadata,
                });
            }
        }
    }
}
ShareMediaMessage.type = (0, core_1.parseMessageType)('https://didcomm.org/media-sharing/1.0/share-media');
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareMediaMessage.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'sent_time' }),
    (0, class_transformer_1.Transform)(({ value }) => (0, transformers_1.DateParser)(value)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ShareMediaMessage.prototype, "sentTime", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => SharedMediaItemDescriptor),
    __metadata("design:type", Array)
], ShareMediaMessage.prototype, "items", void 0);
__decorate([
    (0, core_1.IsValidMessageType)(ShareMediaMessage.type),
    __metadata("design:type", Object)
], ShareMediaMessage.prototype, "type", void 0);
exports.ShareMediaMessage = ShareMediaMessage;
//# sourceMappingURL=ShareMediaMessage.js.map