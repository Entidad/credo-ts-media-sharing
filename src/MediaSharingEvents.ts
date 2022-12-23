import { MediaSharingRecord } from './repository'
import { MediaSharingState } from './model'
import { BaseEvent } from '@aries-framework/core'

export enum MediaSharingEventTypes {
  StateChanged = 'MediaSharingStateChangedEvent',
}

export interface MediaSharingStateChangedEvent extends BaseEvent {
  type: MediaSharingEventTypes.StateChanged
  payload: {
    mediaSharingRecord: MediaSharingRecord
    previousState: MediaSharingState | null
  }
}
