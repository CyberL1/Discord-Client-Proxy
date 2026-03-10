import type { Patch } from "../types";

export default {
  name: "Resume gateway url fix",
  description: "Fixes resume gateway URL",
  code: (content, { instance, host }) => {
    return Buffer.from(
      content
        .toString()
        .replace(
          "e.resume_gateway_url",
          `"${
            instance.settings.useGatewayProxy
              ? `ws://${host}/gateway`
              : (instance.endpoints.gateway ?? "wss://gateway.discord.gg")
          }"`,
        ),
    );
  },
} satisfies Patch;
