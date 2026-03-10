import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { applyPatch, getInstance } from "../utils.ts";
import { Domains } from "../types.ts";
import mime from "mime-types";
import { readdirSync } from "fs";

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
