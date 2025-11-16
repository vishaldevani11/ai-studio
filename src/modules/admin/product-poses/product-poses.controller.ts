import { ROUTES } from '../../../common/constants';
import { Controller, Get, Post, Body, Param, Query, Put, Patch } from '@nestjs/common';
import { ProductPosesService } from './product-poses.service';
import { CreateProductPoseDto } from './dto/create-product-pose.dto';
import { UpdateProductPoseDto } from './dto/update-product-pose.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUtil } from '@/common/utils/response.util';

@ApiTags('Admin - Product Poses')
@Controller(ROUTES.ADMIN.PRODUCT_POSES)
export class ProductPosesController {
  constructor(private readonly service: ProductPosesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product poses (filter by productTypeId or search by name)' })
  @ApiResponse({ status: 200, description: 'Product poses retrieved successfully' })
  @ApiQuery({ name: 'productTypeId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query('productTypeId') productTypeId?: string, @Query('search') search?: string) {
    const result = await this.service.findAll(productTypeId, search);
    return ResponseUtil.success(result, 'Product pose retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product pose by ID' })
  @ApiResponse({ status: 200, description: 'Product pose retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return ResponseUtil.success(result, 'Product pose retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product pose' })
  @ApiResponse({ status: 201, description: 'Product pose created successfully' })
  async create(@Body() dto: CreateProductPoseDto) {
    const result = await this.service.create(dto);
    return ResponseUtil.success(result, 'Product pose created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product pose by ID' })
  @ApiResponse({ status: 200, description: 'Product pose updated successfully' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductPoseDto) {
    const result = await this.service.update(id, dto);
    return ResponseUtil.success(result, 'Product pose updated successfully');
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a product pose by ID' })
  @ApiResponse({ status: 200, description: 'Product pose soft deleted successfully' })
  async softDelete(@Param('id') id: string) {
    const result = await this.service.softDelete(id);
    return ResponseUtil.success(result, 'Product pose updated successfully');
  }
}
