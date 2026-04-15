import type { Patch } from "#src/types.ts";

export default {
  name: "Resume gateway url fix",
  description: "Fixes resume gateway URL",
  code: (content, instance) => {
    return Buffer.from(
      content
        .toString()
        .replace("e.resume_gateway_url", `"${instance.endpoints.gateway}"`),
    );
  },
} satisfies Patch;
