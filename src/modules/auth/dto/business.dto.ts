import { IsString, IsOptional, MaxLength, IsEnum, IsUrl, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessType, BusinessSegment } from '../../../database/entities/user-business.entity';

export class BusinessDto {
  @ApiPropertyOptional({
    description: 'Business name',
    example: 'ABC Enterprises',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'Business name must be a string' })
  @MaxLength(150, { message: 'Business name must not exceed 150 characters' })
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Business type',
    example: 'manufacturer',
    enum: BusinessType,
  })
  @IsOptional()
  @IsEnum(BusinessType, {
    message: 'Business type must be one of: manufacturer, reseller, wholesaler, other',
  })
  businessType?: BusinessType;

  @ApiPropertyOptional({
    description: 'Business segment',
    example: 'clothing',
    enum: BusinessSegment,
  })
  @IsOptional()
  @IsEnum(BusinessSegment, {
    message:
      'Business segment must be one of: clothing, accessories, furniture, electronics, other',
  })
  businessSegment?: BusinessSegment;

  @ApiPropertyOptional({
    description: 'Business description',
    example: 'We manufacture high-quality clothing items',
  })
  @IsOptional()
  @IsString({ message: 'Business description must be a string' })
  businessDescription?: string;

  @ApiPropertyOptional({
    description: 'GST number',
    example: '27ABCDE1234F1Z5',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'GST number must be a string' })
  @MaxLength(20, { message: 'GST number must not exceed 20 characters' })
  gstNumber?: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://www.example.com',
  })
  @IsOptional()
  @ValidateIf(o => o.websiteUrl !== undefined && o.websiteUrl !== null)
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Business logo URL',
    example: 'https://www.example.com/logo.png',
  })
  @IsOptional()
  @ValidateIf(o => o.businessLogo !== undefined && o.businessLogo !== null)
  @IsUrl({}, { message: 'Please provide a valid logo URL' })
  businessLogo?: string;
}
