import Environments from "./environments.json" assert { type: "json" };
import { Environment, GLOBAL_ENV } from "./types.ts";

const proxyHandler = async (req: Request) => {
  const { pathname } = new URL(req.url);
  const selected = Deno.args[0] || Environments[0].name;

  let html = await (await fetch(`https://discord.com${pathname}`)).text();
  const env = Environments.find((e: Environment) =>
    e.name === selected
  ) as Environment;

  Object.keys(env.GLOBAL_ENV).map((e) =>
    html = html.replaceAll(
      new RegExp(`${e}: .[^,\n]*`, "g"),
      `${e}: '${env.GLOBAL_ENV[e as keyof GLOBAL_ENV]}'`,
    )
  );

  if (pathname.startsWith("/assets")) {
    const { status, body, headers } = await fetch(
      `https://discord.com${pathname}`,
    );
    return new Response(body, { status, headers });
  }
  return new Response(html, { headers: { "Content-Type": "text/html" } });
};

Deno.serve({ port: 3000 }, proxyHandler);
