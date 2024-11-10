import { Router } from "express";
import Ajv from "ajv";
import type { JSONSchemaType } from "ajv";
import {
  addInstance,
  deleteInstance,
  editInstance,
  getInstances,
} from "../utils.ts";
import type { Instance } from "../types.ts";

const ajv = new Ajv();
const router = Router();

const isntanceSchema: JSONSchemaType<Instance> = {
  type: "object",
  properties: {
    name: { type: "string", pattern: "^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$" },
    releaseChannel: {
      type: "string",
      oneOf: [{ type: "string", pattern: "stable|ptb|canary|staging" }],
    },
    endpoints: {
      type: "object",
      properties: {
        api: { type: "string" },
        gateway: { type: "string" },
        cdn: { type: "string" },
        media: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  required: ["name", "releaseChannel", "endpoints"],
  additionalProperties: false,
};

router.post("/add", (req, res) => {
  const instance = req.body as Instance;

  const instances = getInstances();

  if (instances.find(({ name }) => name === instance.name)) {
    res.status(400).send({
      error: "Cannot add instance",
      reason: "Instance with that name exists already",
    });
    return;
  }

  const validate = ajv.compile(isntanceSchema);

  if (!validate(instance)) {
    const { instancePath, message } = validate.errors![0];

    res.status(500).send({
      error: "Cannot add instance",
      reason: `${instancePath.replace("/", "")} ${message}`,
    });
    return;
  }

  for (const [key, value] of Object.entries(instance.endpoints)) {
    if (!value.trim()) {
      delete instance.endpoints[key];
    }
  }

  addInstance(instance);
  res.send(instance);
});

router.post("/edit/:name", (req, res) => {
  const data = req.body as Instance;
  const validate = ajv.compile(isntanceSchema);

  if (!validate(data)) {
    const { instancePath, message } = validate.errors![0];

    res.status(500).send({
      error: "Cannot update instance",
      reason: `${instancePath.replace("/", "")} ${message}`,
    });
    return;
  }

  if (data.endpoints) {
    for (const [key, value] of Object.entries(data.endpoints)) {
      if (!value.trim()) {
        delete data.endpoints[key];
      }
    }
  }

  editInstance(req.params.name, data);
  res.send(data);
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
