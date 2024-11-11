import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getInstance } from "../utils.ts";

interface Params {
  name: string;
}

export default (fastify: FastifyInstance) => {
  fastify.get(
    "/:name",
    (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const instance = getInstance(req.params.name);

      if (!instance) {
        return reply.status(404).send("Instance not found");
      }

      // @ts-ignore
      reply.view("edit", { instance, host: req.headers.host });
    },
  );
};
