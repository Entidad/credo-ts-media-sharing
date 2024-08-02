import type { DependencyManager, FeatureRegistry, Module } from '@credo-ts/core';
import { MediaSharingApi } from './MediaSharingApi';
export declare class MediaSharingModule implements Module {
    readonly api: typeof MediaSharingApi;
    /**
     * Registers the dependencies of media sharing module on the dependency manager.
     */
    register(dependencyManager: DependencyManager, featureRegistry: FeatureRegistry): void;
}
