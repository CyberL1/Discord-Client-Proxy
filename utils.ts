import { DOMAINS, ENDPOINTS } from "./contants.ts";
import { Build, Commit, ReleaseChannel } from "./types.ts";

export const getBuild = async (
  channel: ReleaseChannel,
  hash?: string,
) => {
  let build: { version_hash: string; html: string };
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

    build = {
      version_hash: JSON.parse(atob(info)).version_hash,
      html: atob(html),
    };
  } catch {
    console.error(`Cannot connect to github, getting latest ${channel}`);

    const html = await (await fetch(`${DOMAINS[channel]}/app`)).text();

    const { hash } =
      await (await fetch(`${DOMAINS[channel]}/assets/version.${channel}.json`))
        .json();

    build = { version_hash: hash, html };
  }

  return build as Build;
};
