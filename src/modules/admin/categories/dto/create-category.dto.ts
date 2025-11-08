import { IsString, IsUUID, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Men', description: 'Name of the category' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'Clothing for men', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-of-industry', description: 'ID of the related industry' })
  @IsUUID()
  industryId: string;
}
