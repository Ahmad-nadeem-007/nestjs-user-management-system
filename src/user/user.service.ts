import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/utils/pagination.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword
    });
    
    return await this.userRepo.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    return paginate(
      this.userRepo, paginationDto, ['receivedFriendRequests', 'sentFriendRequests']);
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async CustomfindOne(filter: any) {
    const user = await this.userRepo.findOne(filter)
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role', 'status', 'isEmailVerified']
    });
  }

  async save(user: User) {
    // If password is being updated, hash it
    if (user.password && !user.password.startsWith('$2b$')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return await this.userRepo.save(user);
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = Object.assign(user, updateUserDto);
    return await this.userRepo.save(updated);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    console.log("🚀 ~ UserService ~ remove ~ user:", user)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepo.remove(user)
    return { message: 'User deleted successfully' };
  }
}
