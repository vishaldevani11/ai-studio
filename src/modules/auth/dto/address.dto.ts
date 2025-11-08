import { IsString, IsOptional, MaxLength, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiPropertyOptional({
    description: 'Address type',
    example: 'billing',
    enum: ['default', 'billing', 'shipping'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['default', 'billing', 'shipping'], {
    message: 'Address type must be one of: default, billing, shipping',
  })
  addressType?: string;

  @ApiPropertyOptional({
    description: 'Street address',
    example: '123 Main Street',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Street must be a string' })
  @MaxLength(255, { message: 'Street must not exceed 255 characters' })
  street?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Mumbai',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @ApiPropertyOptional({
    description: 'State',
    example: 'Maharashtra',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  @MaxLength(100, { message: 'State must not exceed 100 characters' })
  state?: string;

  @ApiPropertyOptional({
    description: 'Zip/Postal code',
    example: '400001',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Zipcode must be a string' })
  @MaxLength(20, { message: 'Zipcode must not exceed 20 characters' })
  zipcode?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'India',
    maxLength: 100,
    default: 'India',
  })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;
}

