import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsBoolean,
  ValidateIf,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { BusinessDto } from './business.dto';
import { SubscriptionDto } from './subscription.dto';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    maxLength: 150,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150, { message: 'Email must not exceed 150 characters' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(1, { message: 'First name is required' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  @ValidateIf((o) => o.lastName !== undefined && o.lastName !== null)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number (E.164 format recommended)',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Subscribe to email notifications',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Email subscribed must be a boolean' })
  emailSubscribed?: boolean;

  @ApiPropertyOptional({
    description: 'User address information',
    type: AddressDto,
  })
  @IsOptional()
  @IsObject({ message: 'Address must be an object' })
  @ValidateNested({ message: 'Address validation failed' })
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({
    description: 'Business information',
    type: BusinessDto,
  })
  @IsOptional()
  @IsObject({ message: 'Business must be an object' })
  @ValidateNested({ message: 'Business validation failed' })
  @Type(() => BusinessDto)
  business?: BusinessDto;

  @ApiPropertyOptional({
    description: 'Subscription information',
    type: SubscriptionDto,
  })
  @IsOptional()
  @IsObject({ message: 'Subscription must be an object' })
  @ValidateNested({ message: 'Subscription validation failed' })
  @Type(() => SubscriptionDto)
  subscription?: SubscriptionDto;
}
