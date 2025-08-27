import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserJwtPayload } from 'src/common/types/CurrentUser.types';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:otherUserId')
  @ApiOperation({ summary: 'Get chat messages with a specific user' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getMessages(
    @CurrentUser() user: CurrentUserJwtPayload,
    @Param('otherUserId', ParseIntPipe) otherUserId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.chatService.getMessages(user.userId, otherUserId, paginationDto);
  }
@Public()
  @Get('list')
  @ApiOperation({ summary: 'Get list of user chats' })
  @ApiResponse({ status: 200, description: 'Chat list retrieved successfully' })
  async getUserChats(@CurrentUser() user: CurrentUserJwtPayload) {
    return this.chatService.getUserChats(user.userId);
  }
}
