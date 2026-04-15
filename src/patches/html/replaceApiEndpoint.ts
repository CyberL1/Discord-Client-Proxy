import type { Patch } from "#src/types.ts";

export default {
  name: "Replace api endpoint",
  description: "Replaces API_ENDPOINT to the one defined in settings",
  code(content, instance) {
    return Buffer.from(
      content
        .toString()
        .replace(
          /"API_ENDPOINT":"\/\/((ptb|canary)\.)?discord.com\/api"/,
          `"API_ENDPOINT":"${instance.endpoints.api}"`,
        ),
    );
  },
} satisfies Patch;
