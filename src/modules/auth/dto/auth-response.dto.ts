import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../database/entities/user.entity';

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin', 'super_admin'],
  })
  role: string;

  @ApiProperty({
    description: 'User status',
    example: 'active',
    enum: ['active', 'inactive', 'banned'],
  })
  status: string;

  @ApiProperty({
    description: 'Email verified status',
    example: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Phone verified status',
    example: false,
  })
  phoneVerified: boolean;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  lastLogin?: Date;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: UserInfoDto,
  })
  user: UserInfoDto;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin', 'super_admin'],
  })
  role: string;

  @ApiProperty({
    description: 'User status',
    example: 'active',
    enum: ['active', 'inactive', 'banned'],
  })
  status: string;

  @ApiProperty({
    description: 'Email verified status',
    example: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Phone verified status',
    example: false,
  })
  phoneVerified: boolean;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  lastLogin?: Date;
}
