import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FriendRequestStatus } from '../../common/enums/User.enum';

export class GetFriendRequestsDto extends PaginationDto {
  @ApiProperty({ enum: FriendRequestStatus, required: false })
  @IsOptional()
  @IsEnum(FriendRequestStatus)
  status?: FriendRequestStatus;
}
