import type { Patch } from "../types";

export default {
  name: "Voice url fix",
  description: "Fixes voice urls, allowing voice to work on plain http",
  code: (content, { instance }) => {
    return Buffer.from(
      content
        .toString()
        .replace(
          'let e_=/^https/.test("https:")?"wss:":"ws:"',
          `let e_="${instance.settings.useHttps ? "wss:" : "ws:"}"`,
        ),
    );
  },
} satisfies Patch;
