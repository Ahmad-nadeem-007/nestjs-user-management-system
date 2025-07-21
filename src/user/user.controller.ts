import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { tryCatch } from 'src/utlize/tryCatch';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return tryCatch(async () => {
      return this.userService.create(createUserDto);
    }, 'Failed to create user');
  }

  @Get()
  findAll() {
    return tryCatch(async () => {
      return this.userService.findAll();
    }, 'Failed to get users');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return tryCatch(async () => {
      return this.userService.findOne(+id);
    }, 'Failed to get user');
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return tryCatch(async () => {
      return this.userService.update(+id, updateUserDto);
    }, 'Failed to update user');
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return tryCatch(async () => {
      return this.userService.remove(+id);
    }, 'Failed to remove user');
  }
}
