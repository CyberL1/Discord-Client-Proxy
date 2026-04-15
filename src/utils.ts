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
