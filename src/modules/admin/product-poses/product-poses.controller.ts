import { ROUTES } from '../../../common/constants';
import { Controller, Get, Post, Body, Param, Query, Put, Patch } from '@nestjs/common';
import { ProductPosesService } from './product-poses.service';
import { CreateProductPoseDto } from './dto/create-product-pose.dto';
import { UpdateProductPoseDto } from './dto/update-product-pose.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Product Poses')
@Controller(ROUTES.ADMIN.PRODUCT_POSES)
export class ProductPosesController {
  constructor(private readonly service: ProductPosesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product poses (filter by productTypeId or search by name)' })
  @ApiResponse({ status: 200, description: 'Product poses retrieved successfully' })
  findAll(@Query('productTypeId') productTypeId?: string, @Query('search') search?: string) {
    return this.service.findAll(productTypeId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product pose by ID' })
  @ApiResponse({ status: 200, description: 'Product pose retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product pose' })
  @ApiResponse({ status: 201, description: 'Product pose created successfully' })
  create(@Body() dto: CreateProductPoseDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product pose by ID' })
  @ApiResponse({ status: 200, description: 'Product pose updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateProductPoseDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a product pose by ID' })
  @ApiResponse({ status: 200, description: 'Product pose soft deleted successfully' })
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
