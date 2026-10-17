import type { Patch } from "#src/types.ts";

export default {
  name: "Avatar decorations fix",
  description: "Fixes avatar decorations",
  code: (content, instance) => {
    return Buffer.from(
      content
        .toString()
        .replace(
          "${s}/media/v1/collectibles-shop",
          `${instance.settings.useHttps ? "https" : "http"}://${instance.endpoints.cdn}/media/v1/collectibles-shop`,
        ),
    );
  },
} satisfies Patch;
