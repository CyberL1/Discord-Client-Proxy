import type { FastifyRequest } from "fastify";
import type { Instance, MethodRoutes } from "#src/types.ts";
import { editInstance, getInstance, instanceBodySchema } from "#src/utils.ts";

export default {
  GET: (req: FastifyRequest<{ Params: { name: string } }>) => {
    return getInstance(req.params.name);
  },
  POST: {
    schema: instanceBodySchema,
    handler: (
      req: FastifyRequest<{ Params: { name: string }; Body: Instance }>,
    ) => {
      const instance: Instance = {
        name: req.body.name.trim(),
        endpoints: req.body.endpoints,
        settings: {
          releaseChannel: req.body.settings.releaseChannel,
          useHttps: req.body.settings.useHttps,
        },
      };

      return editInstance(req.params.name, instance);
    },
  },
} satisfies MethodRoutes;
