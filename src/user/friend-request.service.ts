import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { FriendRequestStatus } from 'src/common/enums/User.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/utils/pagination.util';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
  ) { }

  async sendFriendRequest(senderId: number, receiverId: number) {
    console.log("🚀 ~ FriendRequestService ~ sendFriendRequest ~ receiverId:", receiverId)
    console.log("🚀 ~ FriendRequestService ~ sendFriendRequest ~ senderId:", senderId)
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    const existingRequest = await this.friendRequestRepo.findOne({
      where: [
        { senderId, receiverId, status: FriendRequestStatus.PENDING },
        { senderId: receiverId, receiverId: senderId, status: FriendRequestStatus.PENDING },
      ],
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists');
    }

    const [sender, receiver] = await Promise.all([
      this.userService.CustomfindOne({ where: { id: senderId } }),
      this.userService.CustomfindOne({ where: { id: receiverId } }),
    ]);
    // console.log("🚀 ~ FriendRequestService ~ sendFriendRequest ~ receiver:", receiver)
    // console.log("🚀 ~ FriendRequestService ~ sendFriendRequest ~ sender:", sender)

    if (sender.friends.includes(receiverId) || receiver.friends.includes(senderId)) {
      throw new BadRequestException('Users are already friends');
    }

    const friendRequest = this.friendRequestRepo.create({
      senderId,
      receiverId,
      status: FriendRequestStatus.PENDING,
    });

    return this.friendRequestRepo.save(friendRequest);
  }

  async respondToFriendRequest(requestId: number, userId: number, status: FriendRequestStatus) {
    const friendRequest = await this.friendRequestRepo.findOne({
      where: { id: requestId, receiverId: userId, status: FriendRequestStatus.PENDING },
    });

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    friendRequest.status = status;
    await this.friendRequestRepo.save(friendRequest);

    if (status === FriendRequestStatus.ACCEPTED) {
      const [sender, receiver] = await Promise.all([
        this.userRepo.findOneOrFail({ where: { id: friendRequest.senderId } }),
        this.userRepo.findOneOrFail({ where: { id: friendRequest.receiverId } }),
      ]);

      sender.friends = Array.from(new Set([...sender.friends, receiver.id]));
      receiver.friends = Array.from(new Set([...receiver.friends, sender.id]));

      await Promise.all([
        this.userRepo.save(sender),
        this.userRepo.save(receiver),
      ]);
    }

    return friendRequest;
  }


  async getFriendRequests(userId: number, query: { page?: number; limit?: number; status?: FriendRequestStatus }) {

    return paginate(this.friendRequestRepo, query, [
      'sender', 'receiver'
    ],
      (qb) => {
        qb.where('(entity.receiverId = :userId OR entity.senderId = :userId)', { userId });
        if (query.status) {
          qb.andWhere('entity.status = :status', { status: query.status });
        }

      }
    )

  }

  async getFriends(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['friends'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepo.find({
      where: { id: In(user.friends) },
      select: ['id', 'name', 'email', 'profilePicture'],
    });
  }
}
