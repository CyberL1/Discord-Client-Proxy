export interface Build {
  name: string;
  info: BuildInfo;
  GLOBAL_ENV?: GlobalEnv;
  html: string;
}

export interface BuildInfo {
  build_number: string;
  version_hash: string;
  host_version: string;
  built_at: number;
}

export interface GlobalEnv {
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
  RELEASE_CHANNEL: ReleaseChannel;
  DEVELOPERS_ENDPOINT: string;
  MARKETING_ENDPOINT: string;
  BRAINTREE_KEY: string;
  STRIPE_KEY: string;
  ADYEN_KEY: string;
  NETWORKING_ENDPOINT: string;
  RTC_LATENCY_ENDPOINT: string;
  ACTIVITY_APPLICATION_HOST: string;
  PROJECT_ENV: string;
  REMOTE_AUTH_ENDPOINT: string;
  SENTRY_TAGS: { buildId: string; buildType: string };
  MIGRATION_SOURCE_ORIGIN: string;
  MIGRATION_DESTINATION_ORIGIN: string;
  HTML_TIMESTAMP: string;
  ALGOLIA_KEY: string;
  PUBLIC_PATH: string;
}

export enum ReleaseChannel {
  STABLE = "stable",
  PTB = "ptb",
  CANARY = "canary",
  STAGING = "staging",
}

export interface Commit {
  sha: string;
  commit: { message: string };
}
