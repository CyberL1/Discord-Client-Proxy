import type { Patch } from "../types";

export default {
  name: "API Endpoint protocol fix",
  description: "Fixes the protocol for API_ENDPOINT",
  code: (content, { instance }) => {
    return Buffer.from(
      content
        .toString()
        .replace(
          '"https:"+window.GLOBAL_ENV.API_ENDPOINT',
          `"${instance.settings.useHttps && !instance.settings.useApiProxy ? "https" : "http"}:"+window.GLOBAL_ENV.API_ENDPOINT`,
        ),
    );
  },
} satisfies Patch;
