import type { Patch } from "#src/types.ts";

export default {
  name: "Replace media proxy endpoint",
  description: "Replaces MEDIA_PROXY_ENDPOINT to the one defined in settings",
  code(content, instance) {
    return Buffer.from(
      content
        .toString()
        .replace(
          '"MEDIA_PROXY_ENDPOINT":"//media.discordapp.net"',
          `"MEDIA_PROXY_ENDPOINT":"${instance.endpoints.media}"`,
        ),
    );
  },
} satisfies Patch;
