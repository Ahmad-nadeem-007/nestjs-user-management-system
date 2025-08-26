import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SendFriendRequestDto {
  @ApiProperty({ description: 'ID of the user to send friend request to' })
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
}
