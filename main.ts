import { existsSync } from "https://deno.land/std@0.218.2/fs/exists.ts";
import Builds from "./builds/builds.json" with { type: "json" };
import { Build, GlobalEnv, ReleaseChannel } from "./types.ts";
import { getBuild } from "./utils.ts";
import { DOMAINS } from "./contants.ts";

const proxyHandler = async (req: Request) => {
  const { pathname } = new URL(req.url);
  const selected = Deno.args[0] || Builds[0].name;

  const build = Builds.find((b) => b.name === selected) as Build;

  if (!build.GLOBAL_ENV) {
    console.warn("GLOBAL_ENV not detected, loading defaults");

    build.GLOBAL_ENV = {
      RELEASE_CHANNEL: ReleaseChannel.STABLE,
    } as GlobalEnv;
  }

  if (!build.GLOBAL_ENV.RELEASE_CHANNEL) {
    build.GLOBAL_ENV.RELEASE_CHANNEL = ReleaseChannel.STABLE;
  }

  if (!existsSync("./builds/hashes.json")) {
    Deno.writeTextFileSync("./builds/hashes.json", "{}");
  }

  const hashes = JSON.parse(Deno.readTextFileSync("./builds/hashes.json"));

  if (!Object.keys(hashes).includes(build.version_hash)) {
    const { html } = await getBuild(
      build.GLOBAL_ENV.RELEASE_CHANNEL,
      build.version_hash,
    );

    if (!html.includes(`"${build.version_hash}"`)) {
      console.log("build IDs don't match, not caching");
      build.html = html;
    } else {
      hashes[build.version_hash] = html;
      Deno.writeTextFileSync("./builds/hashes.json", JSON.stringify(hashes));
    }
  }

  if (pathname.startsWith("/developers")) {
    build.html = await (await fetch(
      `${DOMAINS[build.GLOBAL_ENV.RELEASE_CHANNEL]}${pathname}`,
    )).text();
  }

  if (!build.html) build.html = hashes[build.version_hash];

  if (build.GLOBAL_ENV) {
    Object.keys(build.GLOBAL_ENV).map((e) =>
      build.html = build.html.replaceAll(
        new RegExp(`${e}: .[^,\n]*`, "g"),
        `${e}: '${build.GLOBAL_ENV![e as keyof GlobalEnv]}'`,
      )
    );
  }

  if (pathname.startsWith("/assets")) {
    const { status, body, headers } = await fetch(
      `${DOMAINS[build.GLOBAL_ENV.RELEASE_CHANNEL]}${pathname}`,
    );
    return new Response(body, { status, headers });
  }
  return new Response(build.html, { headers: { "Content-Type": "text/html" } });
};

Deno.serve({ port: 3000 }, proxyHandler);
