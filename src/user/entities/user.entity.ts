import { BaseEntity } from 'src/base-entity/Base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  age: string;
}
