import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromHeader(client);
      if (!token) {
        throw new WsException('Unauthorized');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = payload;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new WsException('Unauthorized: Token expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new WsException('Unauthorized: Invalid token');
      } else {
        throw new WsException('Unauthorized');
      }
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const auth = client.handshake.headers.authorization;
    if (!auth) {
      throw new WsException('Unauthorized');
    }
    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
