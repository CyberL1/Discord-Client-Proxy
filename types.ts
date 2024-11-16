export interface Instance {
  name: string;
  releaseChannel: ReleaseChannel;
  endpoints: InstanceEndpoints;
  settings: InstanceSettings;
}

interface InstanceEndpoints {
  api?: string;
  gateway?: string;
  cdn?: string;
  media?: string;
}

interface InstanceSettings {
  useHttps?: boolean;
  useApiProxy?: boolean;
  useGatewayProxy?: boolean;
  useCdnProxy?: boolean;
  customBuiltInCommands?: boolean;
}

export type ReleaseChannel = "stable" | "ptb" | "canary" | "staging";

export const Domains: { [K in ReleaseChannel]: string } = {
  stable: "https://discord.com",
  ptb: "https://ptb.discord.com",
  canary: "https://canary.discord.com",
  staging: "https://canary.discord.com", // We cannot access staging without authorization. Original domain: https://staging.discord.co
};
