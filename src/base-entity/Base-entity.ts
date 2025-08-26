import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BeforeUpdate } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  
  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

}
