import { IsString, IsOptional, Length, IsUrl, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductBackgroundDto {
  @ApiProperty({ example: 'Forest Landscape', description: 'Name of the product background' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    example: 'A high-quality forest image for outdoor-themed product backgrounds',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://cdn.example.com/product-backgrounds/forest.png' })
  @IsString()
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ example: ['uuid-of-product-theme'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  productThemeIds?: string[];
}
