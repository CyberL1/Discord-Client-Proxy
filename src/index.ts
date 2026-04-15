import { readdirSync } from "node:fs";
import { join } from "node:path";
import fastify from "fastify";
import { Domains } from "./types.ts";
import { getInstance } from "./utils.ts";

process.env.PORT ??= "3000";
const app = fastify();

const registerRoutes = async (directory: string) => {
  const routesDir = readdirSync(`${import.meta.dirname}/${directory}`, {
    withFileTypes: true,
  });

  for (const file of routesDir) {
    if (file.isDirectory()) {
      await registerRoutes(`${directory}/${file.name}`);
      continue;
    }

    const cleanRoute = `${directory.replace("routes", "")}/${file.name.substring(0, file.name.lastIndexOf("."))}`;

    const routePath =
      cleanRoute === "/index"
        ? "/"
        : cleanRoute.replace("/index", "").replaceAll("_", ":");

    console.log(`Loading route: ${routePath}`);

    const { default: route } = await import(`./${directory}/${file.name}`);

    for (const method of Object.keys(route)) {
      app.route({
        url: routePath,
        ...route[method],
        handler: route[method].handler ?? route[method],
        method,
      });
    }
  }
};

await registerRoutes("routes");

app.setNotFoundHandler(async (req, reply) => {
  const instance = getInstance(req.host.split(".")[0]);

  const page = await fetch(
    `${Domains[instance.settings.releaseChannel]}${req.url}`,
    {
      method: req.method,
      headers: req.headers as HeadersInit,
    },
  );

  for (let [header, value] of page.headers) {
    if (header === "content-encoding") {
      continue;
    }

    if (header === "content-security-policy") {
      value = value
        .replace(
          "https://discord.com",
          `${instance.settings.useHttps ? "https" : "http"}://${new URL(`http:${instance.endpoints.api}`).host}`,
        )
        .replace(
          "https://cdn.discordapp.com",
          `${instance.settings.useHttps ? "https" : "http"}://${instance.endpoints.cdn}`,
        )
        .replace(
          "https://media.discordapp.net",
          `${instance.settings.useHttps ? "https" : "http"}:${instance.endpoints.media}`,
        )
        .replace(
          "https://*.discordapp.com",
          `${instance.settings.useHttps ? "https" : "http"}://${instance.endpoints.cdn}`,
        )
        .replace(
          "https://*.discordapp.net",
          `${instance.settings.useHttps ? "https" : "http"}:${instance.endpoints.media}`,
        )
        .replace("wss://*.discord.gg", instance.endpoints.gateway);
    }

    reply.header(header, value);
  }

  let content = Buffer.from(await page.arrayBuffer());

  if (
    page.headers.get("content-type") === "text/html" ||
    page.headers.get("content-type") === "text/javascript"
  ) {
    const patchesDir = readdirSync(
      join(
        import.meta.dirname,
        "patches",
        req.url.endsWith(".js") ? "js" : "html",
      ),
      { withFileTypes: true },
    );

    for (const file of patchesDir) {
      if (file.isDirectory()) {
        continue;
      }

      const { default: patch } = await import(
        `${file.parentPath}/${file.name}`
      );

      content = patch.code(content, instance);
    }
  }

  reply.code(page.status);
  return reply.send(content);
});

await app.listen({ port: Number(process.env.PORT) });
