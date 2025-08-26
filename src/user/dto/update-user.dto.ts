import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email', 'status'] as const),) {


    @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
    @IsOptional()
    profilePicture?: string;

    @ApiPropertyOptional({ example: 33.6844, description: 'Latitude of user location' })
    @IsOptional()
    latitude?: number;

    @ApiPropertyOptional({ example: 73.0479, description: 'Longitude of user location' })
    @IsOptional()
    longitude?: number;

    @ApiPropertyOptional({ example: '123 Main St' })
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: 'New York' })
    @IsOptional()
    city?: string;

    @ApiPropertyOptional({ example: 'USA' })
    @IsOptional()
    country?: string;
}
