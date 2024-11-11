import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getInstance } from "../utils.ts";
import { Domains } from "../types.ts";

export default (fastify: FastifyInstance) => {
  fastify.all("/*", async (req: FastifyRequest, reply: FastifyReply) => {
    const instance = getInstance(req.headers.host?.split(".")[0]!);

    if (!instance) {
      return reply.status(500).send({
        error: "Cannot send api request",
        reason: "Instance not found",
      });
    }

    const instanceApiEndpoint = instance.endpoints.api
      ? `${instance.settings.useHttps ? "https" : "http"}:${instance.endpoints.api.slice(0, -4)}`
      : Domains[instance.releaseChannel];

    if (!instance.endpoints.api) {
      req.headers.origin = "https://discord.com";
    }

    const responseOptions: RequestInit = {
      method: req.method,
      headers: req.headers as HeadersInit,
    };

    if (
      !["HEAD", "GET"].includes(req.method) &&
      req.headers["content-type"] === "application/json" &&
      req.body
    ) {
      responseOptions.body = JSON.stringify(req.body);
    }

    try {
      const response = await fetch(
        `${instanceApiEndpoint}${req.url}`,
        responseOptions,
      );

      reply.status(response.status);

      if (response.status != 204) {
        const json = await response.json();

        reply.send(json);
      } else {
        return;
      }
    } catch (err) {
      console.log("API Proxy error:", err);
      return;
    }
  });
};
