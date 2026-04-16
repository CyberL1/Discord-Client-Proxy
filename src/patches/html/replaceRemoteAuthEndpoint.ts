import type { Patch } from "#src/types.ts";

export default {
  name: "Replace remote auth endpoint",
  description:
    "Replaces REMOTE_AUTH_ENDPOINT endpoint to the one defined in settings",
  code(content, instance) {
    return Buffer.from(
      content
        .toString()
        .replace(
          '"REMOTE_AUTH_ENDPOINT":"wss://remote-auth-gateway.discord.gg"',
          `"REMOTE_AUTH_ENDPOINT":"${instance.endpoints.remoteAuth}"`,
        ),
    );
  },
} satisfies Patch;
