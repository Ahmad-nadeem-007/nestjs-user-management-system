import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { WsCurrentUser } from 'src/auth/decorators/ws-current-user.decorator';
interface CurrentUserJwtPayload {
  email: string;
  sub: number;
  role: string;
}
@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  private userSocketMap = new Map<number, string>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const userId = client.data.user;
    if (userId) {
      this.userSocketMap.set(parseInt(userId), client.id);
      // client.join(`user_${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.userId;
    if (userId) {
      this.userSocketMap.delete(userId);
      // client.leave(`user_${userId}`);
    }
  }

  private generateRoomId(userId1: number, userId2: number): string {
    return `room_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() otherUserId: number,
    @WsCurrentUser() user: CurrentUserJwtPayload,
  ) {
    try {
      const roomId = this.generateRoomId(user.sub, otherUserId);
      client.join(roomId);
      await this.chatService.getOrCreateRoom(user.sub, otherUserId);
      return { status: 'joined', roomId };
    } catch (error) {
      console.log('🚀 ~ ChatGateway ~ handleJoinRoom ~ error:', error);
      return { status: 'error', error: error.message };
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() otherUserId: number,
    @WsCurrentUser() user: CurrentUserJwtPayload,
  ) {
    const roomId = this.generateRoomId(user.sub, otherUserId);
    client.leave(roomId);
    return { status: 'left', roomId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageDto: SendMessageDto,
    @WsCurrentUser() user: CurrentUserJwtPayload,
  ) {
    const message = await this.chatService.sendMessage(user.sub, messageDto);

  const roomId = this.generateRoomId(user.sub, messageDto.receiverId);
    this.server.to(roomId).emit('newMessage', message);

    // const receiverSocket = this.userSocketMap.get(messageDto.receiverId);
    // console.log("🚀 ~ ChatGateway ~ handleSendMessage ~ receiverSocket:", receiverSocket)
    // if (receiverSocket) {
      this.server
        .to(`user_${messageDto.receiverId} `)
        .emit('messageNotification', {
          message,
          sender: user.sub,
          senderName: user.email
        });
    // }

    return message;
  }
}
