import type { HTTPMethods, RouteHandler, RouteOptions } from "fastify";

export type MethodRoutes = {
  [method in HTTPMethods]?: Omit<RouteOptions, "method" | "url"> | RouteHandler;
};

export interface Instance {
  name: string;
  endpoints: InstanceEndpoints;
  settings: InstanceSettings;
}

interface InstanceEndpoints {
  api?: string;
  gateway?: string;
  cdn?: string;
  media?: string;
}

export interface InstanceSettings {
  releaseChannel: ReleaseChannel;
  useHttps?: boolean;
}

export type ReleaseChannel = "stable" | "ptb" | "canary" | "staging";

export const Domains: { [K in ReleaseChannel]: string } = {
  stable: "https://discord.com",
  ptb: "https://ptb.discord.com",
  canary: "https://canary.discord.com",
  staging: "https://canary.discord.com", // Staging cannot be accessed without authorization. Original domain: https://staging.discord.co
};

export interface Patch {
  name: string;
  description: string;
  code: (
    content: Buffer<ArrayBuffer>,
    instance: Instance,
  ) => Buffer<ArrayBuffer>;
}
