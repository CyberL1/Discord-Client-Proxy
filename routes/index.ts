import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getInstances, getInstance } from "../utils.ts";
import { Domains } from "../types.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/*", async (req: FastifyRequest, reply: FastifyReply) => {
    const host = req.headers.host;

    if (host === `localhost:${process.env.PORT}`) {
      const instances = getInstances();

      // @ts-ignore
      return reply.view("list", { instances, host });
    }

    const instance = getInstance(host?.split(".")[0] as string);

    if (!instance) {
      return "Instance not found";
    }

    const page = await fetch(`${Domains[instance.releaseChannel]}${req.url}`);
    let content = await page.text();

    content = content.replace(
      /API_ENDPOINT: '\/\/((ptb|canary).)?discord.com\/api'/,
      `API_ENDPOINT: '${instance.settings.useApiProxy ? `//${host}/api` : (instance.endpoints.api ?? Domains[instance.releaseChannel].slice(6) + "/api")}'`,
    );

    content = content.replace(
      "GATEWAY_ENDPOINT: 'wss://gateway.discord.gg'",
      `GATEWAY_ENDPOINT: '${instance.settings.useGatewayProxy ? `ws://${host}/gateway` : (instance.endpoints.gateway ?? "wss://gateway.discord.gg")}'`,
    );

    content = content.replace(
      "CDN_HOST: 'cdn.discordapp.com'",
      `CDN_HOST: '${instance.settings.useCdnProxy ? `${host}/cdn` : (instance.endpoints.cdn ?? "cdn.discordapp.com")}'`,
    );

    if (instance.endpoints.media) {
      content = content.replace(
        "MEDIA_PROXY_ENDPOINT: '//media.discordapp.net'",
        `MEDIA_PROXY_ENDPOINT: '${instance.endpoints.media}'`,
      );
    }

    if (instance.releaseChannel === "staging") {
      content = content.replace(
        "RELEASE_CHANNEL: 'canary'",
        "RELEASE_CHANNEL: 'staging'",
      );
    }

    content = content.replace(
      /WEBAPP_ENDPOINT: '\/\/((ptb|canary).)?discord.com\'/,
      `WEBAPP_ENDPOINT: '//${host}'`,
    );

    content = content.replaceAll(/integrity="[^"]+"/g, "");

    return reply.type("html").send(content);
  });
};
