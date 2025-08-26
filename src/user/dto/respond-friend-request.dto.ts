import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { FriendRequestStatus } from 'src/common/enums/User.enum';

export class RespondFriendRequestDto {
  @ApiProperty({ description: 'ID of the friend request' })
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiProperty({ enum: FriendRequestStatus, enumName: 'FriendRequestStatus' })
  @IsNotEmpty()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}