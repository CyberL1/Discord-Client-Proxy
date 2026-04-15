import type { Patch } from "#src/types.ts";

export default {
  name: "Force staging",
  description: "Changes release channel to staging if selected",
  code(content, instance) {
    return Buffer.from(
      instance.settings.releaseChannel === "staging"
        ? content
            .toString()
            .replace(
              '"RELEASE_CHANNEL":"canary"',
              `"RELEASE_CHANNEL":"staging"`,
            )
        : content,
    );
  },
} satisfies Patch;
