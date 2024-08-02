"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaSharingModule = void 0;
const core_1 = require("@credo-ts/core");
const MediaSharingApi_1 = require("./MediaSharingApi");
const model_1 = require("./model");
const repository_1 = require("./repository");
const services_1 = require("./services");
class MediaSharingModule {
    constructor() {
        this.api = MediaSharingApi_1.MediaSharingApi;
    }
    /**
     * Registers the dependencies of media sharing module on the dependency manager.
     */
    register(dependencyManager, featureRegistry) {
        // Api
        dependencyManager.registerContextScoped(MediaSharingApi_1.MediaSharingApi);
        // Services
        dependencyManager.registerSingleton(services_1.MediaSharingService);
        // Repositories
        dependencyManager.registerSingleton(repository_1.MediaSharingRepository);
        // Feature Registry
        featureRegistry.register(new core_1.Protocol({
            id: 'https://didcomm.org/media-sharing/1.0',
            roles: [model_1.MediaSharingRole.Sender, model_1.MediaSharingRole.Receiver],
        }));
    }
}
exports.MediaSharingModule = MediaSharingModule;
//# sourceMappingURL=MediaSharingModule.js.map