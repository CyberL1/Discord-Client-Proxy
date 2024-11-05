import { Router } from "express";
import { addInstance, deleteInstance, getInstances } from "../utils.ts";
import type { Instance } from "../types.ts";

const router = Router();

router.post("/add", (req, res) => {
  const instance = req.body as Instance;
  instance.name = instance.name.trim();

  if (!instance.name) {
    res.status(400).send({
      error: "Cannot add instance",
      reason: "name cannot be empty",
    });
    return;
  }

  const instances = getInstances();

  if (instances.find(({ name }) => name === instance.name)) {
    res.status(400).send({
      error: "Cannot add instance",
      reason: "Instance with that name exists already",
    });
    return;
  }

  if (
    !["stable", "ptb", "canary", "staging"].includes(instance.releaseChannel)
  ) {
    res.status(400).send({
      error: "Cannot add instance",
      reason: "releaseChannel must be one of stable, ptb, canary, staging",
    });
    return;
  }

  if (instance.endpoints) {
    for (const [key, value] of Object.entries(instance.endpoints)) {
      if (!value.trim()) {
        delete instance.endpoints[key];
      }
    }
  }

  addInstance(instance);
  res.redirect("/");
});

router.delete("/:name", (req, res) => {
  const deleted = deleteInstance(req.params.name);

  if (!deleted) {
    res.status(400).send({
      error: "Cannot delete instance",
      reason: "Not found",
    });
    return;
  }

  res.send({ deleted: true });
});

export default router;
