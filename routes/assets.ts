import { Router } from "express";
import { getInstance } from "../utils.ts";
import { Domains } from "../types.ts";

const router = Router();

router.get("/*", async (req, res) => {
  const instance = getInstance(req.host.split(".")[0])!;

  const page = await fetch(
    `${Domains[instance.releaseChannel]}/assets${req.path}`,
  );
  let content = Buffer.from(await page.arrayBuffer());
  let extension = req.path.split(".").pop() as string;

  if (extension === "map") {
    extension = "js.map";
  }

  if (["js", "js.map"].includes(extension)) {
    content = Buffer.from(
      content
        .toString()
        .replace(
          '"https:"+window.GLOBAL_ENV.API_ENDPOINT',
          '"http:"+window.GLOBAL_ENV.API_ENDPOINT',
        ),
    );

    content = Buffer.from(
      content
        .toString()
        .replace(
          'PRIMARY_DOMAIN="discord.com"',
          `PRIMARY_DOMAIN="${req.get("host")}"`,
        ),
    );

    content = Buffer.from(
      content
        .toString()
        .replace("e.resume_gateway_url", `"ws://${req.get("host")}/gateway"`),
    );
  }

  res.type(extension);
  res.status(page.status);

  res.send(content);
});

export default router;
