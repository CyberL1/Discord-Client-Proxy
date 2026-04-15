import type { Patch } from "#src/types.ts";

export default {
  name: "Replace gateway endpoint",
  description: "Replaces GATEWAY_ENDPOINT to the one defined in settings",
  code(content, instance) {
    return Buffer.from(
      content
        .toString()
        .replace(
          '"GATEWAY_ENDPOINT":"wss://gateway.discord.gg"',
          `"GATEWAY_ENDPOINT":"${instance.endpoints.gateway}"`,
        ),
    );
  },
} satisfies Patch;
