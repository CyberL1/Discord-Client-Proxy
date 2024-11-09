import { Router } from "express";
import { getInstance } from "../utils.ts";
import { Domains } from "../types.ts";

const router = Router();

router.all("/*", async (req, res) => {
  const instance = getInstance(req.get("host")?.split(".")[0]!);

  if (!instance) {
    res.status(500).send({
      error: "Cannot send api request",
      reason: "Instance not found",
    });
    return;
  }

  const instanceApiEndpoint = instance.endpoints.api
    ? `https:${instance.endpoints.api}`
    : `${Domains[instance.releaseChannel]}/api`;

  if (!instance.endpoints.api) {
    req.headers.origin = "https://discord.com";
  }

  const responseOptions: RequestInit = {
    method: req.method,
    headers: req.headers as HeadersInit,
  };

  if (!["HEAD", "GET"].includes(req.method) && req.body) {
    responseOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(
      `${instanceApiEndpoint}${req.url}`,
      responseOptions,
    );

    res.status(response.status);

    if (response.status != 204) {
      const json = await response.json();

      res.send(json);
    } else {
      res.end();
    }
  } catch (err) {
    console.log("API Proxy error:", err);
  }
});

export default router;
