import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { readdirSync } from "fs";
import mime from "mime-types";
import { Domains } from "../types.ts";
import { applyPatch, getInstance } from "../utils.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/*", async (req: FastifyRequest, reply: FastifyReply) => {
    const instance = getInstance(req.host.split(".")[0])!;

    const page = await fetch(`${Domains[instance.releaseChannel]}${req.url}`);

    let content = Buffer.from(await page.arrayBuffer());
    const extension = req.url.split(".").pop() as string;

    if (req.url.startsWith("/assets/web.") && extension === "js") {
      const patchFiles = readdirSync("patches");

      for (const patchFile of patchFiles) {
        content = await applyPatch(`./patches/${patchFile}`, content, {
          instance,
          host: req.headers.host,
        });
      }
    }

    reply.type(mime.lookup(extension).toString());
    reply.status(page.status);

    return content;
  });
};
