import express from "express";
import { readdirSync } from "fs";

const app = express();

app.set("view engine", "ejs");

process.env.PORT ??= "3000";

const routesDir = readdirSync("routes").filter((file) => file.endsWith(".ts"));

for (const route of routesDir) {
  const cleanRoute = route.split(".")[0];
  const routePath = cleanRoute == "index" ? "/" : `/${cleanRoute}`;

  console.log(`Loading route: ${routePath}`);
  app.use(routePath, (await import(`./routes/${route}`)).default);
}

app.listen(process.env.PORT, () => {
  console.log(`App ready on port ${process.env.PORT}`);
});
