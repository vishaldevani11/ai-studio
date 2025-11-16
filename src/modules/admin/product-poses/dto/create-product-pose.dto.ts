import { IsString, IsUUID, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductPoseDto {
  @ApiProperty({ example: 'Look-Left', description: 'Product pose display name' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'Shoulders down, head tilted left', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'data:image/png;base64,...', required: true })
  @IsString()
  imageBase64: string;

  @ApiProperty({ example: 'uuid-of-product-type', description: 'Associated product type ID' })
  @IsUUID()
  productTypeId: string;
}
