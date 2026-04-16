import type { FastifyRequest } from "fastify";
import type { Instance, MethodRoutes } from "#src/types.ts";
import { addInstance, getInstances, instanceBodySchema } from "#src/utils.ts";

export default {
  GET: getInstances,
  POST: {
    schema: instanceBodySchema,
    handler: (req: FastifyRequest<{ Body: Instance }>) => {
      const instance: Instance = {
        name: req.body.name.trim(),
        endpoints: req.body.endpoints,
        settings: req.body.settings,
      };

      return addInstance(instance);
    },
  },
} satisfies MethodRoutes;
