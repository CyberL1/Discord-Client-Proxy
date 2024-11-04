import { existsSync, readFileSync, writeFileSync } from "fs";
import type { Instance } from "./types.ts";

const checkForData = (): void => {
  if (!existsSync("instances.json")) {
    writeFileSync("instances.json", "[]");
  }
};

export const getInstances = (): Instance[] => {
  checkForData();

  const file = readFileSync("instances.json", { encoding: "utf-8" });
  const parsed = JSON.parse(file);

  return parsed;
};

export const getInstance = (name: string): Instance | undefined => {
  const instances = getInstances();

  return instances.find((instance) => instance.name === name);
};
