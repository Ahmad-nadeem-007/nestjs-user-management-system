import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Room } from './entities/room.entity';
import { User } from '../user/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { paginate } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChatListItem } from './interfaces/chat-list-item.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private generateRoomId(userId1: number, userId2: number): string {
    return `room_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
  }

   async getOrCreateRoom(
    userId1: number,
    userId2: number,
  ): Promise<Room> {
    const roomId = this.generateRoomId(userId1, userId2);
    let room = await this.roomRepo.findOne({ where: { roomId } });

    if (!room) {
      room = this.roomRepo.create({
        roomId,
        user1Id: Math.min(userId1, userId2),
        user2Id: Math.max(userId1, userId2),
      });
      await this.roomRepo.save(room);
    }

    return room;
  }

  async sendMessage(
    senderId: number,
    messageDto: SendMessageDto,
  ): Promise<ChatMessage> {
    const { content, receiverId } = messageDto;

    // Check if users exist
    const [sender, receiver] = await Promise.all([
      this.userRepo.findOne({ where: { id: senderId } }),
      this.userRepo.findOne({ where: { id: receiverId } }),
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    // Get or create room
    const room = await this.getOrCreateRoom(senderId, receiverId);

    // Create and save message
    const message = this.chatMessageRepo.create({
      content,
      sender,
      receiver,
      room,
      isRead: false,
    });

    return this.chatMessageRepo.save(message);
  }

  async getMessages(
    userId: number,
    otherUserId: number,
    paginationDto: PaginationDto,
  ) {
    const roomId = this.generateRoomId(userId, otherUserId);
    const room = await this.roomRepo.findOne({ where: { roomId } });

    if (!room) {
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: paginationDto.limit,
          totalPages: 0,
          currentPage: paginationDto.page,
        },
      };
    }

    // Mark messages as read
    await this.chatMessageRepo.update(
      {
        room: { id: room.id },
        receiver: { id: userId },
        isRead: false,
      },
      { isRead: true },
    );

    // Get paginated messages
    return paginate(
      this.chatMessageRepo,
      paginationDto,
      ['sender', 'receiver'],
      (qb) => {
        qb.where('entity.room = :id', { roomId: room.id }).orderBy(
          'entity.createdAt',
          'DESC',
        );
      },
    );
  }

  async getUserChats(userId: number): Promise<any> {
    // Get all rooms where user is involved
    const rooms = await this.roomRepo
      .createQueryBuilder('room')
      .where('room.user1Id = :userId OR room.user2Id = :userId', { userId })
      .getMany();

    const chats: ChatListItem[] = [];

    for (const room of rooms) {
      // Get latest message for each room
      const latestMessage = await this.chatMessageRepo
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.receiver', 'receiver')
        .where('message.room = :roomId', { roomId: room.id })
        .orderBy('message.createdAt', 'DESC')
        .getOne();

      if (latestMessage) {
        const otherUserId =
          room.user1Id === userId ? room.user2Id : room.user1Id;
        const otherUser = await this.userRepo.findOne({
          where: { id: otherUserId },
        });

        const unreadCount = await this.chatMessageRepo.count({
          where: {
            room: { id: room.id },
            receiver: { id: userId },
            isRead: false,
          },
        });

        if (otherUser) {
          chats.push({
            roomId: room.roomId,
            otherUser,
            latestMessage: {
              content: latestMessage.content,
              createdAt: latestMessage.createdAt,
              isRead: latestMessage.isRead,
            },
            unreadCount,
          });
        }
      }
    }
    return chats.sort(
      (a, b) =>
        b.latestMessage.createdAt.getTime() -
        a.latestMessage.createdAt.getTime(),
    );
  }
}
