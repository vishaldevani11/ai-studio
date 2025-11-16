import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessDto } from './business.dto';
import { UserRole, UserStatus } from '../../../database/entities/user.entity';

export class ProfileDto {
  @ApiProperty({ description: "User's unique identifier" })
  id: string;

  @ApiProperty({ description: "User's email address" })
  email: string;

  @ApiProperty({ description: "User's first name" })
  firstName: string;

  @ApiPropertyOptional({ description: "User's last name" })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number (Indian format +91)',
    example: '+919876543210',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User profile image URL (optional)',
  })
  profileImage?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User account status',
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiPropertyOptional({
    description: 'Business details associated with the user',
    type: BusinessDto,
  })
  business?: BusinessDto;

  @ApiPropertyOptional({
    description: 'Date and time user was created',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Date and time user was last updated',
  })
  updatedAt?: Date;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
