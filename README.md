# Aries JavaScript Media Sharing plug-in

This module is used to provide an Aries Agent built with Aries Framework JavaScript means to manage [Media Sharing protocol](https://github.com/2060-io/aries-rfcs/tree/feature/media-sharing/features/xxxx-media-sharing).

It's conceived as a plug-in for Aries Framework JavaScript which can be injected to an existing agent instance:

```ts
import { MediaSharingModule } from 'aries-javascript-media-sharing'

const agent = new Agent({
  config: {
    /* agent config */
  },
  dependencies,
  modules: { media: new MediaSharingModule() },
})
```

Once instantiated, media module API can be accessed under `agent.modules.media` namespace

## Usage

### Sending a media file

![](./doc/diagrams/sender.png)

### Receiving a media file

![](./doc/diagrams/recipient.png)

> **TODO**
