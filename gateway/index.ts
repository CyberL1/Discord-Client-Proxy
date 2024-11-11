import type { FastifyInstance, FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { getInstance } from "../utils.ts";

export default (fastify: FastifyInstance) => {
  fastify.get(
    "/gateway",
    { websocket: true },
    (ws: WebSocket, req: FastifyRequest) => {
      const instance = getInstance(req.headers.host?.split(".")[0]!);

      if (!instance) {
        ws.close(1008, "Instance not found");
        return;
      }

      const instanceGatewayEndpoint =
        instance.endpoints.gateway ?? "wss://gateway.discord.gg";
      const instanceWS = new WebSocket(`${instanceGatewayEndpoint}${req.url}`);

      let dataParsed = null;

      ws.onmessage = ({ data }) => {
        dataParsed = JSON.parse(data as string);
      };

      instanceWS.onopen = () => instanceWS.send(JSON.stringify(dataParsed));

      instanceWS.onmessage = ({ data }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      };

      instanceWS.onclose = () => ws.close();
    },
  );

  console.log("Gateway Proxy ready on /gateway");
};
