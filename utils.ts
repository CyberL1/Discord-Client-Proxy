import { DOMAINS, ENDPOINTS } from "./contants.ts";
import { BuildInfo, Commit, ReleaseChannel } from "./types.ts";

export const getBuild = async (
  channel: ReleaseChannel,
  hash?: string,
) => {
  let build: { info: BuildInfo; html: string };

  try {
    const commits =
      await (await fetch(`${ENDPOINTS.RELEASE_CHANNELS_COMMITS}/${channel}`))
        .json() as Commit[];

    const webCommits = commits.filter(({ commit }) =>
      commit.message.includes("Web")
    );

    const hashRegex = /\((.+)\)/;

    if (!hash) hash = webCommits[0].commit.message.match(hashRegex)?.[1];

    const { content: info } =
      await (await fetch(`${ENDPOINTS.RELEASE_CHANNELS}/${channel}/info.json`))
        .json();

    const { content: html } = await (await fetch(
      `${ENDPOINTS.RELEASE_CHANNELS}/${channel}/web/scripts/index.html`,
    )).json();

    build = { info: JSON.parse(atob(info)), html: atob(html) };
  } catch {
    console.error(`Cannot connect to github, getting latest ${channel}`);

    const html = await (await fetch(`${DOMAINS[channel]}/app`)).text();

    const { hash } =
      await (await fetch(`${DOMAINS[channel]}/assets/version.${channel}.json`))
        .json();

    const info = {
      build_number: `latest (${DOMAINS[channel]})`,
      version_hash: hash,
      host_version: `latest (${DOMAINS[channel]})`,
      built_at: new Date().getTime(),
    };

    build = { info, html };
  }

  return build;
};
