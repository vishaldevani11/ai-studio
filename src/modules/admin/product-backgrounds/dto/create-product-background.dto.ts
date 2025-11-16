import { IsString, IsOptional, Length, IsArray, IsUUID } from 'class-validator';
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

  @ApiProperty({ example: 'data:image/png;base64,...', required: true })
  @IsString()
  imageBase64: string;

  @ApiProperty({ example: ['uuid-of-product-theme'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  productThemeIds?: string[];
}
