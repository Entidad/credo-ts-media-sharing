import { agentDependencies } from '@aries-framework/node'
import { Agent, ConnectionRecord, ConsoleLogger, EncryptedMessage, LogLevel } from '@aries-framework/core'
import { v4 as uuid } from 'uuid'
import { firstValueFrom, ReplaySubject, Subject } from 'rxjs'
import { MediaSharingModule } from '../src/MediaSharingModule'
import { MediaSharingRecord } from '../src/repository'
import { SubjectOutboundTransport } from './transport/SubjectOutboundTransport'
import { SubjectInboundTransport } from './transport/SubjectInboundTransport'
import { recordsAddedByType } from './recordUtils'

const logger = new ConsoleLogger(LogLevel.info)

export type SubjectMessage = { message: EncryptedMessage; replySubject?: Subject<SubjectMessage> }

describe('media test', () => {
  let aliceAgent: Agent<{ media: MediaSharingModule }>
  let bobAgent: Agent<{ media: MediaSharingModule }>
  let aliceWalletId: string
  let aliceWalletKey: string
  let bobWalletId: string
  let bobWalletKey: string
  let aliceConnectionRecord: ConnectionRecord | undefined
  let bobConnectionRecord: ConnectionRecord | undefined

  beforeEach(async () => {
    aliceWalletId = uuid()
    aliceWalletKey = uuid()
    bobWalletId = uuid()
    bobWalletKey = uuid()

    const aliceMessages = new Subject<SubjectMessage>()
    const bobMessages = new Subject<SubjectMessage>()

    const subjectMap = {
      'rxjs:alice': aliceMessages,
      'rxjs:bob': bobMessages,
    }

    // Initialize alice
    aliceAgent = new Agent({
      config: {
        label: 'alice',
        endpoints: ['rxjs:alice'],
        walletConfig: { id: aliceWalletId, key: aliceWalletKey },
        logger,
      },
      dependencies: agentDependencies,
      modules: { media: new MediaSharingModule() },
    })

    aliceAgent.registerOutboundTransport(new SubjectOutboundTransport(subjectMap))
    aliceAgent.registerInboundTransport(new SubjectInboundTransport(aliceMessages))
    await aliceAgent.initialize()

    // Initialize bob
    bobAgent = new Agent({
      config: {
        endpoints: ['rxjs:bob'],
        label: 'bob',
        walletConfig: { id: bobWalletId, key: bobWalletKey },
        logger,
      },
      dependencies: agentDependencies,
      modules: { media: new MediaSharingModule() },
    })

    bobAgent.registerOutboundTransport(new SubjectOutboundTransport(subjectMap))
    bobAgent.registerInboundTransport(new SubjectInboundTransport(bobMessages))
    await bobAgent.initialize()

    const outOfBandRecord = await aliceAgent.oob.createInvitation({
      autoAcceptConnection: true,
    })

    let { connectionRecord } = await bobAgent.oob.receiveInvitationFromUrl(
      outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'https://example.com/ssi' }),
      { autoAcceptConnection: true }
    )

    bobConnectionRecord = await bobAgent.connections.returnWhenIsConnected(connectionRecord!.id)
    aliceConnectionRecord = (await aliceAgent.connections.findAllByOutOfBandId(outOfBandRecord.id))[0]
    aliceConnectionRecord = await aliceAgent.connections.returnWhenIsConnected(aliceConnectionRecord!.id)
  })

  afterEach(async () => {
    // Wait for messages to flush out
    await new Promise((r) => setTimeout(r, 1000))

    if (aliceAgent) {
      await aliceAgent.shutdown()

      if (aliceAgent.wallet.isInitialized && aliceAgent.wallet.isProvisioned) {
        await aliceAgent.wallet.delete()
      }
    }

    if (bobAgent) {
      await bobAgent.shutdown()

      if (bobAgent.wallet.isInitialized && bobAgent.wallet.isProvisioned) {
        await bobAgent.wallet.delete()
      }
    }
  })

  test('Create media and share it', async () => {
    const subjectAlice = new ReplaySubject<MediaSharingRecord>()
    const subjectBob = new ReplaySubject<MediaSharingRecord>()
    recordsAddedByType(aliceAgent, MediaSharingRecord).pipe().subscribe(subjectAlice)

    const aliceRecord = await aliceAgent.modules.media.create({
      connectionId: aliceConnectionRecord!.id,
      metadata: { metadataKey1: 'metadata-val', metadataKey2: { key21: 'value21', key22: 'value22' } },
    })

    expect(aliceRecord.metadata.get('metadataKey1')).toEqual('metadata-val')
    expect(aliceRecord.metadata.get('metadataKey2')).toMatchObject({ key21: 'value21', key22: 'value22' })

    await aliceAgent.modules.media.share({ recordId: aliceRecord.id, items: [{ uri: 'http://blabla' }] })

    recordsAddedByType(bobAgent, MediaSharingRecord)
      //.pipe(filter((e) => e.state === MediaSharingState.MediaShared))
      .subscribe(subjectBob)

    const bobThread = await firstValueFrom(subjectBob)
    const aliceThread = await firstValueFrom(subjectAlice)
  })
})
