import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendRequest])],
  controllers: [UserController, FriendRequestController],
  providers: [UserService, FriendRequestService],
  exports: [UserService],
})
export class UserModule {}
