import Fastify from "fastify";
import FastifyView from "@fastify/view";
import { readdirSync } from "fs";
import ejs from "ejs";
import FastifyWebsocket from "@fastify/websocket";

const fastify = Fastify({ logger: true });

fastify.register(FastifyView, { engine: { ejs }, root: "views" });

process.env.PORT ??= "3000";

const routesDir = readdirSync("routes").filter((file) => file.endsWith(".ts"));

for (const route of routesDir) {
  const cleanRoute = route.split(".")[0];
  const routePath = cleanRoute == "index" ? "/" : `/${cleanRoute}`;

  console.log(`Loading route: ${routePath}`);
  fastify.register((await import(`./routes/${route}`)).default, {
    prefix: routePath,
  });
}

fastify.register(FastifyWebsocket);
fastify.register((await import("./gateway/index.ts")).default);

fastify.listen({ port: Number(process.env.PORT) }, async (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log(`App ready on port ${process.env.PORT} and can be accessed on http://localhost:${process.env.PORT}`);
});
