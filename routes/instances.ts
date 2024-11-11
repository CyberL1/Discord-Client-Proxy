import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import {
  addInstance,
  deleteInstance,
  editInstance,
  getInstances,
} from "../utils.ts";
import type { Instance } from "../types.ts";

interface Params {
  name: string;
}

export default (fastify: FastifyInstance) => {
  const schema: FastifySchema = {
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$",
        },
        releaseChannel: {
          type: "string",
          pattern: "^stable$|^ptb$|^canary$|^staging$",
        },
        endpoints: {
          type: "object",
          properties: {
            api: { type: "string" },
            gateway: { type: "string" },
            cdn: { type: "string" },
            media: { type: "string" },
          },
          additionalProperties: false,
        },
      },
      required: ["name", "releaseChannel", "endpoints"],
      additionalProperties: false,
    },
  };

  fastify.post(
    "/add",
    { schema },
    (req: FastifyRequest, reply: FastifyReply) => {
      const instance = req.body as Instance;

      const instances = getInstances();

      if (instances.find(({ name }) => name === instance.name)) {
        return reply.status(500).send({
          error: "Cannot add instance",
          reason: "Instance with that name exists already",
        });
      }

      for (const [key, value] of Object.entries(instance.endpoints)) {
        if (!value.trim()) {
          delete instance.endpoints[key];
        }
      }

      addInstance(instance);
      return instance;
    },
  );

  fastify.post(
    "/edit/:name",
    { schema },
    (req: FastifyRequest<{ Params: Params }>) => {
      const data = req.body as Instance;

      if (data.endpoints) {
        for (const [key, value] of Object.entries(data.endpoints)) {
          if (!value.trim()) {
            delete data.endpoints[key];
          }
        }
      }

      editInstance(req.params.name, data);
      return data;
    },
  );

  fastify.delete(
    "/:name",
    (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const deleted = deleteInstance(req.params.name);

      if (!deleted) {
        return reply.status(400).send({
          error: "Cannot delete instance",
          reason: "Not found",
        });
      }

      return { deleted: true };
    },
  );
};
