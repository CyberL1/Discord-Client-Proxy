import { ReleaseChannel } from "./types.ts";

const GITHUB_REPO = "https://api.github.com/repos/xHyroM/discord-datamining";

export const DOMAINS = {
  [ReleaseChannel.STABLE]: "https://discord.com",
  [ReleaseChannel.PTB]: "https://ptb.discord.com",
  [ReleaseChannel.CANARY]: "https://canary.discord.com",
  [ReleaseChannel.STAGING]: "https://canary.discord.com", // We cannot access staging without authorization. Original domain: https://staging.discord.co
};

export const ENDPOINTS = {
  GITHUB_REPO,
  RELEASE_CHANNELS: `${GITHUB_REPO}/contents/data/client/channels`,
  RELEASE_CHANNELS_COMMITS: `${GITHUB_REPO}/commits?path=data/client/channels`,
};
