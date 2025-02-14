import {
  APITags,
  BadRequest,
  BrowserServerOptions,
  BrowserWebsocketRoute,
  PlaywrightChromium,
  Request,
  SystemQueryParameters,
  WebsocketRoutes,
} from '@browserless.io/browserless';
import { Duplex } from 'stream';

export interface QuerySchema extends SystemQueryParameters {
  launch?: BrowserServerOptions | string;
}

export default class PlaywrightChromiumRoute extends BrowserWebsocketRoute {
  auth = true;
  browser = PlaywrightChromium;
  concurrency = true;
  description = `Connect to Chromium with any playwright style library.`;
  path = WebsocketRoutes.playwrightChromium;
  tags = [APITags.browserWS];
  handler = async (
    req: Request,
    socket: Duplex,
    head: Buffer,
    browser: PlaywrightChromium,
  ): Promise<void> => {
    const isPlaywright = req.headers['user-agent']
      ?.toLowerCase()
      .includes('playwright');

    if (!isPlaywright) {
      throw new BadRequest(
        `Only playwright is allowed to work with this route`,
      );
    }

    return browser.proxyWebSocket(req, socket, head);
  };
}
