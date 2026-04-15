import type { Patch } from "#src/types.ts";

export default {
  name: "Replace webapp endpoint",
  description: "Replaces WEBAPP_ENDPOINT to localhost",
  code(content, instance) {
    return Buffer.from(
      content
        .toString()
        .replace(
          /"WEBAPP_ENDPOINT":"\/\/((ptb|canary)\.)?discord.com"/,
          `"WEBAPP_ENDPOINT":"//localhost:${process.env.PORT}"`,
        ),
    );
  },
} satisfies Patch;
