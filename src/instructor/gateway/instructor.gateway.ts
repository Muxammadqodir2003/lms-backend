import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class InstructorGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    const role = client.handshake.auth.role;
    if (role === 'ADMIN') client.join('admins');
  }

  sendToAdmin(data: any): void {
    this.server.to('admins').emit('message', data);
  }
}
