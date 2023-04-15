import type { DependencyManager, FeatureRegistry, Module } from '@aries-framework/core'

import { Protocol } from '@aries-framework/core'

import { MediaSharingApi } from './MediaSharingApi'
import { MediaSharingRole } from './model'
import { MediaSharingRepository } from './repository'
import { MediaSharingService } from './services'

export class MediaSharingModule implements Module {
  public readonly api = MediaSharingApi

  /**
   * Registers the dependencies of media sharing module on the dependency manager.
   */
  public register(dependencyManager: DependencyManager, featureRegistry: FeatureRegistry) {
    // Api
    dependencyManager.registerContextScoped(MediaSharingApi)

    // Services
    dependencyManager.registerSingleton(MediaSharingService)

    // Repositories
    dependencyManager.registerSingleton(MediaSharingRepository)

    // Feature Registry
    featureRegistry.register(
      new Protocol({
        id: 'https://2060.io/didcomm/media-sharing/0.1',
        roles: [MediaSharingRole.Sender, MediaSharingRole.Receiver],
      })
    )
  }
}
