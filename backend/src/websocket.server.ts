import * as WebSocket from 'ws';
import * as http from 'http';

export class WebSocketServer {
  private server: http.Server;
  private wss: WebSocket.Server;

  constructor(port: number) {
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });

    this.setupWebSocket();
    this.startServer(port);
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Cliente conectado.');

      ws.on('close', () => {
        console.log('Cliente desconectado.');
      });
    });
  }

  private startServer(port: number) {
    this.server.listen(port, () => {
      console.log(`Servidor WebSocket está ouvindo na porta ${port}.`);
    });
  }

  broadcastMessage(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

