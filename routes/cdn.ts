import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getInstance } from "../utils.ts";

export default (fastify: FastifyInstance) => {
  fastify.all("/*", async (req: FastifyRequest, reply: FastifyReply) => {
    const instance = getInstance(req.headers.host?.split(".")[0]!);

    if (!instance) {
      return reply.status(500).send({
        error: "Cannot send cdn request",
        reason: "Instance not found",
      });
    }

    const instanceCdnEndpoint = instance.endpoints.cdn
      ? `${instance.settings.useHttps ? "https" : "http"}:${instance.endpoints.cdn}`
      : "https://cdn.discordapp.com";

    const responseOptions: RequestInit = {
      method: req.method,
      headers: req.headers as HeadersInit,
    };

    try {
      const response = await fetch(
        `${instanceCdnEndpoint}${req.url.substring(4)}`,
        responseOptions,
      );

      const buffer = Buffer.from(await response.arrayBuffer());

      reply.type(response.headers.get("content-type")!);
      reply.status(response.status).send(buffer);
    } catch (err) {
      console.log("CDN Proxy error:", err);
    }
  });
};
