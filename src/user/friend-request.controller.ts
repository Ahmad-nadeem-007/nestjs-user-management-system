import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrentUserJwtPayload } from 'src/common/types/CurrentUser.types';
import { tryCatch } from 'src/utils/tryCatch';
import { FriendRequestStatus } from 'src/common/enums/User.enum';
import { GetFriendRequestsDto } from './dto/get-friend-requests.dto';



@ApiTags('Friend Requests')
@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) { }

  @Post('send')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: 201, description: 'Friend request sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendFriendRequest(
    @CurrentUser() user: CurrentUserJwtPayload,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    return tryCatch(async () => {
      return this.friendRequestService.sendFriendRequest(
        user.userId,
        sendFriendRequestDto.receiverId,
      );
    }, 'Failed to send request');

  }

  @Post('respond')
  @ApiOperation({ summary: 'Respond to a friend request' })
  @ApiResponse({ status: 200, description: 'Response processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  async respondToFriendRequest(
    @CurrentUser() user: CurrentUserJwtPayload,
    @Body() respondFriendRequestDto: RespondFriendRequestDto,
  ) {
    return tryCatch(async () => {
      return this.friendRequestService.respondToFriendRequest(
        respondFriendRequestDto.requestId,
        user.userId,
        respondFriendRequestDto.status,
      );
    }, 'Failed to respond to request');
  }

  @Get()
  @ApiOperation({ summary: 'Get friend requests' })
  @ApiQuery({
    name: 'status',
    enum: FriendRequestStatus,
    required: false,
    description: 'Filter requests by status (optional)'
  })
  @ApiResponse({ status: 200, description: 'Friend requests retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFriendRequests(
    @CurrentUser() user: CurrentUserJwtPayload,
    @Query() query: GetFriendRequestsDto
  ) {
    return tryCatch(async () => {
      return this.friendRequestService.getFriendRequests(user.userId, query);
    }, 'Failed to get friend requests');
  }

  @Get('friends')
  @ApiOperation({ summary: 'Get user\'s friends' })
  @ApiResponse({ status: 200, description: 'Friends retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFriends(@CurrentUser() user: CurrentUserJwtPayload) {
    return tryCatch(async () => {
      return this.friendRequestService.getFriends(user.userId);
    }, 'Failed to get friends');
  }
}
