import { DOMAINS, ENDPOINTS } from "./contants.ts";
import { Build, BuildInfo, Commit, ReleaseChannel } from "./types.ts";

export const getBuild = async (
  channel: ReleaseChannel,
  hash?: string,
) => {
  let build: { info: BuildInfo; html: string };
  let commitHash;

  if (channel === ReleaseChannel.STAGING) channel = ReleaseChannel.CANARY;

  try {
    const headers = { headers: { "accept": "application/vnd.github+json" } };
    const commitsUrl = `${ENDPOINTS.RELEASE_CHANNELS_COMMITS}/${channel}/web`;

    const commits = await (await fetch(commitsUrl, headers)).json() as Commit[];

    if (!hash) commitHash = commits[0].sha;
    else {
      const commit = commits.find(({ commit }) =>
        commit.message.includes(`${hash}`)
      );

      commitHash = commit?.sha;
    }

    const { content: info } = await (await fetch(
      `${ENDPOINTS.RELEASE_CHANNELS}/${channel}/info.json?ref=${commitHash}`,
    )).json();

    const { content: html } = await (await fetch(
      `${ENDPOINTS.RELEASE_CHANNELS}/${channel}/web/scripts/index.html?ref=${commitHash}`,
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

  return build as Build;
};
