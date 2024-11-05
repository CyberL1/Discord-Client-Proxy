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

export const addInstance = (data: Instance): void => {
  const instances = getInstances();
  instances.push(data);

  writeFileSync("instances.json", JSON.stringify(instances));
};

export const deleteInstance = (name: string): boolean => {
  const instances = getInstances();
  const instanceByName = instances.find((instance) => instance.name === name);

  if (!instanceByName) {
    return false;
  }

  instances.splice(instances.indexOf(instanceByName), 1);
  writeFileSync("instances.json", JSON.stringify(instances));

  return true;
};
