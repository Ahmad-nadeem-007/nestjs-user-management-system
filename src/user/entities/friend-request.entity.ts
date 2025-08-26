import { BaseEntity } from 'src/base-entity/Base-entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from 'src/common/enums/User.enum';



@Entity()
export class FriendRequest extends BaseEntity {
  @ApiProperty({ description: 'User who sent the friend request' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  senderId: number;

  @ApiProperty({ description: 'User who received the friend request' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column()
  receiverId: number;

  @ApiProperty({ description: 'Status of the friend request', enum: FriendRequestStatus })
  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}
