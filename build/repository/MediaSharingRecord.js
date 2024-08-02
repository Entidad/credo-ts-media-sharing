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
exports.MediaSharingRecord = exports.SharedMediaItem = void 0;
const uuid_1 = require("uuid");
const core_1 = require("@credo-ts/core");
const class_transformer_1 = require("class-transformer");
class SharedMediaItem {
    constructor(options) {
        var _a;
        if (options) {
            this.id = (_a = options.id) !== null && _a !== void 0 ? _a : core_1.utils.uuid();
            this.uri = options.uri;
            this.mimeType = options.mimeType;
            this.description = options.description;
            this.byteCount = options.byteCount;
            this.fileName = options.fileName;
            this.ciphering = options.ciphering;
            this.metadata = options.metadata;
        }
    }
}
exports.SharedMediaItem = SharedMediaItem;
class MediaSharingRecord extends core_1.BaseRecord {
    constructor(props) {
        var _a, _b, _c;
        super();
        this.type = MediaSharingRecord.type;
        if (props) {
            this.id = (_a = props.id) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)();
            this.createdAt = (_b = props.createdAt) !== null && _b !== void 0 ? _b : new Date();
            this.role = props.role;
            this.state = props.state;
            this.connectionId = props.connectionId;
            this.threadId = props.threadId;
            this.parentThreadId = props.parentThreadId;
            this.description = props.description;
            this.items = (_c = props.items) !== null && _c !== void 0 ? _c : [];
            this.sentTime = props.sentTime;
            if (props.metadata) {
                Object.keys(props.metadata).forEach((key) => {
                    var _a;
                    this.metadata.set(key, (_a = props.metadata) === null || _a === void 0 ? void 0 : _a[key]);
                });
            }
        }
    }
    getTags() {
        return Object.assign(Object.assign({}, this._tags), { threadId: this.threadId, parentThreadId: this.parentThreadId, connectionId: this.connectionId, role: this.role, state: this.state });
    }
    assertRole(expectedRole) {
        if (this.role !== expectedRole) {
            throw new core_1.CredoError(`Media sharing record has invalid role ${this.role}. Expected role ${expectedRole}.`);
        }
    }
    assertState(expectedStates) {
        if (!Array.isArray(expectedStates)) {
            expectedStates = [expectedStates];
        }
        if (!expectedStates.includes(this.state)) {
            throw new Error(`Media sharing record is in invalid state ${this.state}. Valid states are: ${expectedStates.join(', ')}.`);
        }
    }
}
MediaSharingRecord.type = 'MediaSharingRecord';
__decorate([
    (0, class_transformer_1.Type)(() => SharedMediaItem),
    __metadata("design:type", Array)
], MediaSharingRecord.prototype, "items", void 0);
exports.MediaSharingRecord = MediaSharingRecord;
//# sourceMappingURL=MediaSharingRecord.js.map