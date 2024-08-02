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
exports.MediaSharingApi = void 0;
const core_1 = require("@credo-ts/core");
const handlers_1 = require("./handlers");
const repository_1 = require("./repository");
const services_1 = require("./services");
let MediaSharingApi = class MediaSharingApi {
    constructor(messageSender, mediaSharingService, connectionService, agentContext) {
        this.messageSender = messageSender;
        this.mediaSharingService = mediaSharingService;
        this.connectionService = connectionService;
        this.agentContext = agentContext;
        this.agentContext.dependencyManager.registerMessageHandlers([
            new handlers_1.ShareMediaHandler(this.mediaSharingService),
            new handlers_1.RequestMediaHandler(this.mediaSharingService),
        ]);
    }
    /**
     * Sender role: create a new shared media record (no actual message will be sent)
     *
     */
    async create(options) {
        const connection = await this.connectionService.getById(this.agentContext, options.connectionId);
        const record = await this.mediaSharingService.createRecord(this.agentContext, {
            connectionRecord: connection,
            parentThreadId: options.parentThreadId,
            items: options.items,
            description: options.description,
            metadata: options.metadata,
        });
        return record;
    }
    /**
     * Sender role: share media, providing actual file description details
     */
    async share(options) {
        var _a;
        const record = await this.mediaSharingService.getById(this.agentContext, options.recordId);
        const connection = await this.connectionService.getById(this.agentContext, record.connectionId);
        const { message: payload } = await this.mediaSharingService.createMediaShare(this.agentContext, {
            record,
            items: (_a = options.items) === null || _a === void 0 ? void 0 : _a.map((item) => new repository_1.SharedMediaItem(item)),
            description: options.description,
            parentThreadId: options.parentThreadId,
        });
        await this.messageSender.sendMessage(new core_1.OutboundMessageContext(payload, {
            agentContext: this.agentContext,
            connection,
            associatedRecord: record,
        }));
        return record;
    }
    /**
     * Receiver role: request media
     */
    async request(options) {
        const connection = await this.connectionService.getById(this.agentContext, options.connectionId);
        const { message: payload } = await this.mediaSharingService.createMediaRequest(this.agentContext, {
            connectionId: options.connectionId,
            itemIds: options.itemIds,
            description: options.description,
            parentThreadId: options.parentThreadId,
        });
        await this.messageSender.sendMessage(new core_1.OutboundMessageContext(payload, {
            agentContext: this.agentContext,
            connection,
        }));
    }
    async setMetadata(recordId, key, value) {
        const record = await this.mediaSharingService.getById(this.agentContext, recordId);
        record.metadata.set(key, value);
        await this.mediaSharingService.update(this.agentContext, record);
    }
    /**
     * Retrieve all records
     *
     * @returns List containing all records
     */
    getAll() {
        return this.mediaSharingService.getAll(this.agentContext);
    }
    /**
     * Find a record by id
     *
     * @param recordId the record id
     * @returns  the record or null if not found
     */
    findById(recordId) {
        return this.mediaSharingService.findById(this.agentContext, recordId);
    }
    /**
     * Find a record by thread id
     *
     * @param recordId the record id
     * @returns  the record or null if not found
     */
    findByThreadId(recordId) {
        return this.mediaSharingService.findByThreadId(this.agentContext, recordId);
    }
};
MediaSharingApi = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [core_1.MessageSender,
        services_1.MediaSharingService,
        core_1.ConnectionService,
        core_1.AgentContext])
], MediaSharingApi);
exports.MediaSharingApi = MediaSharingApi;
//# sourceMappingURL=MediaSharingApi.js.map