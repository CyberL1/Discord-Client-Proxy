import { Router } from "express";
import { getInstances, getInstance } from "../utils.ts";
import { Domains } from "../types.ts";

const router = Router();

router.get("/*", async (req, res) => {
  const host = req.get("host");

  if (host === `localhost:${process.env.PORT}`) {
    const instances = getInstances();

    res.render("list", { instances, host });
    return;
  }

  const instance = getInstance(host?.split(".")[0] as string);

  if (!instance) {
    res.send("Instance not found");
    return;
  }

  const page = await fetch(`${Domains[instance.releaseChannel]}/${req.path}`);
  let content = await page.text();

  if (instance.endpoints) {
    if (instance.endpoints.gateway) {
      content = content.replace(
        "GATEWAY_ENDPOINT: 'wss://gateway.discord.gg'",
        `GATEWAY_ENDPOINT: '${instance.endpoints.gateway}'`,
      );
    }

    if (instance.endpoints.cdn) {
      content = content.replace(
        "CDN_HOST: 'cdn.discordapp.com'",
        `CDN_HOST: '${instance.endpoints.cdn}'`,
      );
    }

    if (instance.endpoints.media) {
      content = content.replace(
        "MEDIA_PROXY_ENDPOINT: '//media.discordapp.net'",
        `MEDIA_PROXY_ENDPOINT: '${instance.endpoints.media}'`,
      );
    }
  }

  if (instance.releaseChannel === "staging") {
    content = content.replace(
      "RELEASE_CHANNEL: 'canary'",
      "RELEASE_CHANNEL: 'staging'",
    );
  }

  content = content.replace(
    /API_ENDPOINT: '\/\/((ptb|canary).)?discord.com\/api'/,
    `API_ENDPOINT: '/api'`,
  );

  content = content.replace(
    /WEBAPP_ENDPOINT: '\/\/((ptb|canary).)?discord.com\'/,
    `WEBAPP_ENDPOINT: '//${host}'`,
  );

  content = content.replaceAll(/integrity="[^"]+"/g, "");

  res.send(content);
});

export default router;
