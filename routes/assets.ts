import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getInstance } from "../utils.ts";
import { Domains } from "../types.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/*", async (req: FastifyRequest, reply: FastifyReply) => {
    const instance = getInstance(req.host.split(".")[0])!;

    const page = await fetch(`${Domains[instance.releaseChannel]}${req.url}`);

    let content = Buffer.from(await page.arrayBuffer());
    let extension = req.url.split(".").pop() as string;

    if (extension === "map") {
      extension = "js.map";
    }

    if (["js", "js.map"].includes(extension)) {
      content = Buffer.from(
        content
          .toString()
          .replace(
            '"https:"+window.GLOBAL_ENV.API_ENDPOINT',
            '"http:"+window.GLOBAL_ENV.API_ENDPOINT',
          ),
      );

      content = Buffer.from(
        content
          .toString()
          .replace(
            'PRIMARY_DOMAIN="discord.com"',
            `PRIMARY_DOMAIN="${req.headers.host}"`,
          ),
      );

      content = Buffer.from(
        content
          .toString()
          .replace(
            "e.resume_gateway_url",
            `"ws://${req.headers.host}/gateway"`,
          ),
      );
    }

    reply.type(extension);
    reply.status(page.status);

    return content;
  });
};
