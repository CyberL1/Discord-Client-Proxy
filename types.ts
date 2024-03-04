export interface Build {
  name: string;
  info: BuildInfo;
  endpoints?: Endpoints;
  channel: ReleaseChannel;
  html: string;
}

export interface BuildInfo {
  build_number: string;
  version_hash: string;
  host_version: string;
  built_at: number;
}

export interface Endpoints {
  API_ENDPOINT: string;
  API_VERSION: number;
  GATEWAY_ENDPOINT: string;
  WEBAPP_ENDPOINT: string;
  CDN_HOST: string;
  ASSET_ENDPOINT: string;
  MEDIA_PROXY_ENDPOINT: string;
  WIDGET_ENDPOINT: string;
  INVITE_HOST: string;
  GUILD_TEMPLATE_HOST: string;
  GIFT_CODE_HOST: string;
  DEVELOPERS_ENDPOINT: string;
  MARKETING_ENDPOINT: string;
  NETWORKING_ENDPOINT: string;
  RTC_LATENCY_ENDPOINT: string;
  ACTIVITY_APPLICATION_HOST: string;
  REMOTE_AUTH_ENDPOINT: string;
}

export enum ReleaseChannel {
  STABLE = "stable",
  PTB = "ptb",
  CANARY = "canary",
  STAGING = "staging",
}

export interface Commit {
  commit: { message: string };
}
