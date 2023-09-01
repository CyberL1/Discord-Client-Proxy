const proxyHandler = async (req: Request) => {
  const { pathname } = new URL(req.url);

  const html = await (await fetch(`https://discord.com${pathname}`)).text();

  if (pathname.startsWith("/assets")) {
    const { status, body } = await fetch(`https://discord.com${pathname}`);
    return new Response(body, { status });
  }

  return new Response(html, { headers: { "Content-Type": "text/html" } });
};

Deno.serve({ port: 3000 }, proxyHandler);
