import { Router } from "express";
import { getInstance } from "../utils.ts";

const router = Router();

router.all("/*", async (req, res) => {
  const instance = getInstance(req.get("host")?.split(".")[0]!);

  if (!instance) {
    res.status(500).send({
      error: "Cannot send cdn request",
      reason: "Instance not found",
    });
    return;
  }

  const instanceCdnEndpoint = instance.endpoints.cdn
    ? `https:${instance.endpoints.cdn}`
    : "https://cdn.discordapp.com";

  const responseOptions: RequestInit = {
    method: req.method,
    headers: req.headers as HeadersInit,
  };

  try {
    const response = await fetch(
      `${instanceCdnEndpoint}${req.url}`,
      responseOptions,
    );

    const buffer = Buffer.from(await response.arrayBuffer());

    res.type(response.headers.get("content-type")!);
    res.status(response.status).send(buffer);
  } catch (err) {
    console.log("CDN Proxy error:", err);
  }
});

export default router;
