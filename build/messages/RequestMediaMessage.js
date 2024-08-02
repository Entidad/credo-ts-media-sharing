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
exports.RequestMediaMessage = void 0;
const core_1 = require("@credo-ts/core");
const transformers_1 = require("@credo-ts/core/build/utils/transformers");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RequestMediaMessage extends core_1.AgentMessage {
    constructor(options) {
        var _a;
        super();
        this.type = RequestMediaMessage.type.messageTypeUri;
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
            this.itemIds = options.itemIds;
        }
    }
}
RequestMediaMessage.type = (0, core_1.parseMessageType)('https://didcomm.org/media-sharing/1.0/request-media');
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestMediaMessage.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'sent_time' }),
    (0, class_transformer_1.Transform)(({ value }) => (0, transformers_1.DateParser)(value)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], RequestMediaMessage.prototype, "sentTime", void 0);
__decorate([
    (0, core_1.IsValidMessageType)(RequestMediaMessage.type),
    __metadata("design:type", Object)
], RequestMediaMessage.prototype, "type", void 0);
exports.RequestMediaMessage = RequestMediaMessage;
//# sourceMappingURL=RequestMediaMessage.js.map