import { BaseEntity } from 'src/base-entity/Base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class Room extends BaseEntity {
  @Column({ unique: true })
  roomId: string;

  

  @Column()
  user1Id: number;

  @Column()
  user2Id: number; // Sender or Receiver 2

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
