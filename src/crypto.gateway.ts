import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * WebSocket gateway for handling real-time cryptocurrency rate updates.
 * For dev - use in cors-origin the host machine's IP address "http://localhost:3000"
 * For prod - initially use the service name "http://crypto-frontend-service:3000"
              after deploying the frontend service to the cluster, use the newley created frontend LoadBalancer service's IP address
 */
@WebSocketGateway({
  cors: {
    origin: 'http://crypto-frontend-service:3000',
    credentials: true,
  },
})
export class CryptoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;
  private logger: Logger = new Logger('CryptoGateway');

  /**
   * Handles WebSocket client connections.
   *
   * @param client - The socket instance representing the client.
   * @param args - Additional connection arguments.
   */
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // You can emit an event back to the client to confirm connection if needed
    client.emit('connection', 'Successfully connected to server');
  }

  /**
   * Handles WebSocket client disconnections.
   *
   * @param client - The socket instance representing the client.
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handles subscription requests from clients for crypto rate updates.
   *
   * @param client - The socket instance representing the client.
   * @param payload - The data sent by the client during subscription.
   */
  @SubscribeMessage('subscribeToCryptoRates')
  handleSubscribe(client: Socket, payload: any): void {
    this.logger.log(
      `Client ${client.id} subscribed to crypto rates with payload:`,
      payload,
    );
  }

  /**
   * Broadcasts an update signal to all connected clients about new crypto rates.
   */
  async broadcastUpdateSignal() {
    this.logger.log('Broadcasting update signal to all connected clients');
    this.server.emit('cryptoRatesUpdateSignal');
  }
}
