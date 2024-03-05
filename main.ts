import { existsSync } from "https://deno.land/std@0.218.2/fs/exists.ts";
import Builds from "./builds/builds.json" with { type: "json" };
import { Build, Endpoints, ReleaseChannel } from "./types.ts";
import { getBuild } from "./utils.ts";
import { DOMAINS } from "./contants.ts";

const proxyHandler = async (req: Request) => {
  const { pathname } = new URL(req.url);
  const selected = Deno.args[0] || Builds[0].name;

  const build = Builds.find((b) => b.name === selected) as Build;

  if (!build.channel) build.channel = ReleaseChannel.STABLE;

  if (!existsSync("./builds/hashes.json")) {
    Deno.writeTextFileSync("./builds/hashes.json", "{}");
  }

  const hashes = JSON.parse(Deno.readTextFileSync("./builds/hashes.json"));

  if (!Object.keys(hashes).includes(build.info.version_hash)) {
    const { html } = await getBuild(build.channel, build.info.version_hash);

    if (!html.includes(`"${build.info.version_hash}"`)) {
      console.log("build IDs don't match, not caching");
      build.html = html;
    } else {
      hashes[build.info.version_hash] = html;
      Deno.writeTextFileSync("./builds/hashes.json", JSON.stringify(hashes));
    }
  }

  if (!build.html) build.html = hashes[build.info.version_hash];

  if (build.endpoints) {
    Object.keys(build.endpoints).map((e) =>
      build.html = build.html.replaceAll(
        new RegExp(`${e}: .[^,\n]*`, "g"),
        `${e}: '${build.endpoints![e as keyof Endpoints]}'`,
      )
    );
  }

  build.html = build.html.replace(
    /RELEASE_CHANNEL: .[^,\n]*/,
    `RELEASE_CHANNEL: '${build.channel}'`,
  );

  if (pathname.startsWith("/assets")) {
    const { status, body, headers } = await fetch(
      `${DOMAINS[build.channel]}${pathname}`,
    );
    return new Response(body, { status, headers });
  }
  return new Response(build.html, { headers: { "Content-Type": "text/html" } });
};

Deno.serve({ port: 3000 }, proxyHandler);
