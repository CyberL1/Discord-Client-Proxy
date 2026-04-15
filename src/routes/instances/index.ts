import type { MethodRoutes } from "#src/types.ts";
import { getInstances } from "#src/utils.ts";

export default {
  GET: getInstances,
} satisfies MethodRoutes;
