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
  }

  res.type(extension);
  res.status(page.status);

  res.send(content);
});

export default router;
