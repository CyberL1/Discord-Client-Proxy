import type { Patch } from "#src/types.ts";

export default {
  name: "Replace cdn host",
  description: "Replaces CDN_HOST to the one defined in settings",
  code(content, instance) {
    return Buffer.from(
      content
        .toString()
        .replace(
          '"CDN_HOST":"cdn.discordapp.com"',
          `"CDN_HOST":"${instance.endpoints.cdn}"`,
        ),
    );
  },
} satisfies Patch;
