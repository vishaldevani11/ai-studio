import { ROUTES } from '../../../common/constants';
import { Controller, Get, Post, Body, Param, Query, Put, Patch } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseUtil } from '@/common/utils/response.util';

@ApiTags('Admin - Product Types')
@Controller(ROUTES.ADMIN.PRODUCT_TYPES)
export class ProductTypesController {
  constructor(private readonly service: ProductTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product types (optionally filtered by category or name)' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query('categoryId') categoryId?: string, @Query('search') search?: string) {
    const result = await this.service.findAll(categoryId, search);
    return ResponseUtil.success(result, 'Product Types retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product type by ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return ResponseUtil.success(result, 'Product Types retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product type' })
  async create(@Body() dto: CreateProductTypeDto) {
    const result = await this.service.create(dto);
    return ResponseUtil.success(result, 'Product Types created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product type by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductTypeDto) {
    const result = await this.service.update(id, dto);
    return ResponseUtil.success(result, 'Product Types updated successfully');
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a product type by ID' })
  async softDelete(@Param('id') id: string) {
    const result = await this.service.softDelete(id);
    return ResponseUtil.success(result, 'Product Types updated successfully');
  }
}
