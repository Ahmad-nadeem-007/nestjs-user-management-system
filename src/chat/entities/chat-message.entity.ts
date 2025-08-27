import { BaseEntity } from 'src/base-entity/Base-entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class ChatMessage extends BaseEntity {

  @ManyToOne(() => User, (user) => user.sentMessages, { eager: true })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, { eager: true })
  receiver: User;
  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @Column()
  content: string;


  @Column({ default: false })
  isRead: boolean;
}
