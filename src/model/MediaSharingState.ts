/**
 * Media Sharing states as defined in
 * https://github.com/2060-io/aries-rfcs/tree/feature/media-sharing/features/xxxx-media-sharing#roles#states
 */

export enum MediaSharingState {
  Init = 'init',
  MediaRequested = 'media-requested',
  MediaShared = 'media-shared',
  Done = 'done',
}
