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
exports.MediaSharingService = void 0;
const core_1 = require("@credo-ts/core");
const tsyringe_1 = require("tsyringe");
const MediaSharingEvents_1 = require("../MediaSharingEvents");
const repository_1 = require("../repository");
const messages_1 = require("../messages");
const model_1 = require("../model");
let MediaSharingService = class MediaSharingService {
    constructor(mediaSharingRepository, eventEmitter) {
        this.mediaSharingRepository = mediaSharingRepository;
        this.eventEmitter = eventEmitter;
    }
    /**
     * Creates a new record
     *
     * @param options
     * @returns
     */
    async createRecord(agentContext, options) {
        // Create record
        const record = new repository_1.MediaSharingRecord({
            connectionId: options.connectionRecord.id,
            parentThreadId: options.parentThreadId,
            role: model_1.MediaSharingRole.Sender,
            state: model_1.MediaSharingState.Init,
            description: options.description,
            items: options.items,
            metadata: options.metadata,
        });
        await this.mediaSharingRepository.save(agentContext, record);
        this.eventEmitter.emit(agentContext, {
            type: MediaSharingEvents_1.MediaSharingEventTypes.StateChanged,
            payload: {
                mediaSharingRecord: record,
                previousState: null,
            },
        });
        return record;
    }
    /**
     * Creates a media share
     * @param options
     * @returns
     */
    async createMediaShare(agentContext, options) {
        const record = options.record;
        const previousState = options.record.state;
        if (options.description) {
            record.description = options.description;
        }
        if (options.items) {
            record.items = options.items;
        }
        if (options.parentThreadId) {
            record.parentThreadId = options.parentThreadId;
        }
        if (!record.items) {
            throw new core_1.CredoError('MediaSharingRecord does not contain any item to share');
        }
        // Create message
        const message = new messages_1.ShareMediaMessage({
            parentThreadId: record.parentThreadId,
            description: record.description,
            items: record.items,
        });
        // Update record
        record.threadId = message.id;
        record.state = model_1.MediaSharingState.MediaShared;
        await this.mediaSharingRepository.update(agentContext, record);
        this.eventEmitter.emit(agentContext, {
            type: MediaSharingEvents_1.MediaSharingEventTypes.StateChanged,
            payload: {
                mediaSharingRecord: record,
                previousState: previousState,
            },
        });
        return { record, message };
    }
    /**
     * Creates a media request
     * @param options
     * @returns
     */
    async createMediaRequest(agentContext, options) {
        const conenctionId = options.connectionId;
        // Create message
        const message = new messages_1.RequestMediaMessage({
            parentThreadId: options.parentThreadId,
            description: options.description,
            itemIds: options.itemIds,
        });
        return { message };
    }
    async processShareMedia(messageContext) {
        var _a, _b;
        const { message } = messageContext;
        const record = await this.findByThreadId(messageContext.agentContext, message.threadId);
        // Media sharing record already exists
        if (record) {
            throw new core_1.CredoError(`There is already a MediaSharingRecord with thread Id ${message.threadId}`);
        }
        else {
            const connection = messageContext.assertReadyConnection();
            if (message.items.length === 0) {
                throw new core_1.CredoError('There are no valid items in MediaSharingRecord');
            }
            // Process items
            const items = [];
            for (const item of message.items) {
                const relatedAttachment = (_a = message.appendedAttachments) === null || _a === void 0 ? void 0 : _a.find((attachment) => attachment.id === item.attachmentId);
                if (!relatedAttachment) {
                    throw new core_1.CredoError(`No attachment found for shared item ${item.id}`);
                }
                if (!relatedAttachment.mimeType) {
                    throw new core_1.CredoError(`Missing MIME type for shared item ${item.id}`);
                }
                if (!relatedAttachment.data.links || !relatedAttachment.data.links.length) {
                    throw new core_1.CredoError(`Missing URI for for shared item ${item.id}`);
                }
                items.push({
                    id: item.id,
                    ciphering: item.ciphering,
                    metadata: item.metadata,
                    mimeType: relatedAttachment.mimeType,
                    uri: relatedAttachment.data.links[0],
                    byteCount: relatedAttachment.byteCount,
                    description: relatedAttachment.description,
                    fileName: relatedAttachment.filename,
                });
            }
            // New record
            const record = new repository_1.MediaSharingRecord({
                connectionId: connection.id,
                threadId: message.id,
                parentThreadId: (_b = messageContext.message.thread) === null || _b === void 0 ? void 0 : _b.parentThreadId,
                state: model_1.MediaSharingState.MediaShared,
                role: model_1.MediaSharingRole.Receiver,
                items,
                description: message.description,
                sentTime: message.sentTime,
            });
            await this.mediaSharingRepository.save(messageContext.agentContext, record);
            this.eventEmitter.emit(messageContext.agentContext, {
                type: MediaSharingEvents_1.MediaSharingEventTypes.StateChanged,
                payload: {
                    mediaSharingRecord: record,
                    previousState: null,
                },
            });
        }
        return record;
    }
    /**
     * Retrieve all media sharing records
     *
     * @returns List containing all auth code records
     */
    getAll(agentContext) {
        return this.mediaSharingRepository.getAll(agentContext);
    }
    /**
     * Retrieve a record by id
     *
     * @param recordId The record id
     * @throws {RecordNotFoundError} If no record is found
     * @return The record
     *
     */
    getById(agentContext, recordId) {
        return this.mediaSharingRepository.getById(agentContext, recordId);
    }
    /**
     * Find a record by id
     *
     * @param recordId record id
     * @returns The record or null if not found
     */
    findById(agentContext, recordId) {
        return this.mediaSharingRepository.findById(agentContext, recordId);
    }
    /**
     * Delete a record by id
     *
     * @param recordId the record id
     */
    async deleteById(agentContext, recordId) {
        const mediaSharingRecord = await this.getById(agentContext, recordId);
        return this.mediaSharingRepository.delete(agentContext, mediaSharingRecord);
    }
    /**
     * Retrieve a record by thread id
     *
     * @param threadId The thread id
     * @throws {RecordNotFoundError} If no record is found
     * @throws {RecordDuplicateError} If multiple records are found
     * @returns The media sharing record
     */
    async findByThreadId(agentContext, threadId) {
        return this.mediaSharingRepository.findSingleByQuery(agentContext, {
            threadId,
        });
    }
    /**
     * Retrieve auth code records by connection id
     *
     * @param connectionId The connection id
     * @param threadId The thread id
     * @throws {RecordNotFoundError} If no record is found
     * @throws {RecordDuplicateError} If multiple records are found
     * @returns The media sharing record
     */
    async findAllByConnectionId(agentContext, connectionId) {
        return this.mediaSharingRepository.findByQuery(agentContext, {
            connectionId,
        });
    }
    /**
     * Update a record in storage repository, making it persistent
     *
     * @param record
     * @returns
     */
    async update(agentContext, record) {
        return await this.mediaSharingRepository.update(agentContext, record);
    }
};
MediaSharingService = __decorate([
    (0, tsyringe_1.scoped)(tsyringe_1.Lifecycle.ContainerScoped),
    __metadata("design:paramtypes", [repository_1.MediaSharingRepository, core_1.EventEmitter])
], MediaSharingService);
exports.MediaSharingService = MediaSharingService;
//# sourceMappingURL=MediaSharingService.js.map