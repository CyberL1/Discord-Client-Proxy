import { WebSocketServer } from "ws";
import { server } from "../index.ts";
import { getInstance } from "../utils.ts";

const wss = new WebSocketServer({ noServer: true, path: "/gateway" });

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    const instance = getInstance(req.headers.host?.split(".")[0]!);

    if (!instance) {
      ws.close(1008, "Instance not found");
      return;
    }

    const instanceGatewayEndpoint =
      instance.endpoints.gateway ?? "wss://gateway.discord.gg";
    const instanceWS = new WebSocket(`${instanceGatewayEndpoint}${req.url}`);

    wss.emit("connection", ws, instanceWS);
  });
});

wss.on("connection", (ws: WebSocket, instanceWS: WebSocket) => {
  let dataParsed = null;

  ws.onmessage = ({ data }) => {
    dataParsed = JSON.parse(data);
  };

  instanceWS.onopen = () => instanceWS.send(JSON.stringify(dataParsed));

  instanceWS.onmessage = ({ data }) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  };

  ws.onclose = () => instanceWS.close();
  instanceWS.onclose = () => ws.close();
});

console.log("Gateway Proxy ready on /gateway");
