import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ahmad Nadeem',
    description: 'User ka full name',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
  @ApiProperty({
    example: 'ahmad@example.com',
    description: 'Unique email address of the user',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 25,
    description: 'User ki age (number honi chahiye)',
  })
  @IsNotEmpty({ message: 'Age is required' })
  @IsNumber({}, { message: 'Age must be a number' })
  age: string;
}
