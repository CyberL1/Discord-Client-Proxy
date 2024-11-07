import { Router } from "express";
import { getInstance } from "../utils.ts";

const router = Router();

router.get("/:name", (req, res) => {
  const instance = getInstance(req.params.name);

  if (!instance) {
    res.status(404).send("Instance not found");
    return;
  }

  res.render("edit", { instance, host: req.get("host") });
});

export default router;
