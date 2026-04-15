import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Instance } from "./types.ts";

export const normalizeName = (name: string): string => {
  return name.trim().toLowerCase().replaceAll(" ", "-");
};

const instancesFilePath = `${import.meta.dirname}/../instances.json`;

export const getInstances = (): Instance[] => {
  if (!existsSync(instancesFilePath)) {
    writeFileSync(instancesFilePath, "[]");
  }

  const instanceFileContents = readFileSync(instancesFilePath, {
    encoding: "utf-8",
  });

  return JSON.parse(instanceFileContents);
};

export const getInstance = (name: string): Instance => {
  const instances = getInstances();

  const instance = instances.find(
    (instance) =>
      normalizeName(instance.name) === normalizeName(name.toLowerCase()),
  );

  if (!instance) {
    throw new Error("Instance not found");
  }

  return instance;
};

export const addInstance = (instance: Instance): Instance => {
  const instances = getInstances();

  if (
    instances.find(
      ({ name }) => normalizeName(name) === normalizeName(instance.name),
    )
  ) {
    throw new Error("Instance already exists");
  }

  instances.push(instance);
  writeFileSync(instancesFilePath, JSON.stringify(instances));

  return instance;
};

export const instanceBodySchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      endpoints: {
        type: "object",
        properties: {
          api: { type: "string", minLength: 1 },
          gateway: { type: "string", minLength: 1 },
          cdn: { type: "string", minLength: 1 },
          media: { type: "string", minLength: 1 },
        },
        additionalProperties: false,
      },
      settings: {
        type: "object",
        properties: {
          releaseChannel: {
            type: "string",
            pattern: "^stable|ptb|canary|staging$",
          },
          useHttps: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["releaseChannel"],
      },
    },
    additionalProperties: false,
    required: ["name"],
  },
};
