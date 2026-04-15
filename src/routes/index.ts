import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MethodRoutes } from "#src/types.ts";

export default {
  GET: (req, reply) => {
    reply.type("html");
    return readFileSync(join(import.meta.dirname, "..", "pages", "index.html"));
  },
} satisfies MethodRoutes;
