export interface Environment {
  name: string;
  GLOBAL_ENV: GLOBAL_ENV;
}

export interface GLOBAL_ENV {
  API_ENDPOINT: string;
  API_VERSION: number;
  GATEWAY_ENDPOINT: string;
  CDN_HOST: string;
  MEDIA_PROXY_ENDPOINT: string;
  WIDGET_ENDPOINT: string;
  INVITE_HOST: string;
  GUILD_TEMPLATE_HOST: string;
  GIFT_CODE_HOST: string;
  RELEASE_CHANNEL: string;
  MARKETING_ENDPOINT: string;
  NETWORKING_ENDPOINT: string;
  RTC_LATENCY_ENDPOINT: string;
  ACTIVITY_APPLICATION_HOST: string;
  REMOTE_AUTH_ENDPOINT: string;
}
