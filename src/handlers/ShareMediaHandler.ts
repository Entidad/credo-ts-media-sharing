import { MessageHandler, MessageHandlerInboundMessage } from '@aries-framework/core'
import { ShareMediaMessage } from '../messages/ShareMediaMessage'
import { MediaSharingService } from '../services'

export class ShareMediaHandler implements MessageHandler {
  public supportedMessages = [ShareMediaMessage]
  private mediaSharingService: MediaSharingService

  public constructor(mediaSharingService: MediaSharingService) {
    this.mediaSharingService = mediaSharingService
  }

  public async handle(inboundMessage: MessageHandlerInboundMessage<ShareMediaHandler>) {
    inboundMessage.assertReadyConnection()

    await this.mediaSharingService.processShareMedia(inboundMessage)
  }
}
