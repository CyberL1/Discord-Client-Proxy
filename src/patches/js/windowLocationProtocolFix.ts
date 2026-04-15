import type { Patch } from "#src/types.ts";

export default {
  name: "window.location protocol fix",
  description: "Fixes the protocol for window.location",
  code: (content, instance) => {
    return Buffer.from(
      content
        .toString()
        .replace(
          /(window\.)?location\.protocol/g,
          `"${instance.settings.useHttps ? "https" : "http"}:"`,
        ),
    );
  },
} satisfies Patch;
