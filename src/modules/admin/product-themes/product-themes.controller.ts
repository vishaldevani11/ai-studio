import { ROUTES } from '../../../common/constants';
import { Controller, Get, Post, Body, Param, Put, Patch, Query } from '@nestjs/common';
import { ProductThemesService } from './product-themes.service';
import { CreateProductThemeDto } from './dto/create-product-theme.dto';
import { UpdateProductThemeDto } from './dto/update-product-theme.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ResponseUtil } from '@/common/utils/response.util';

@ApiTags('Admin - Product Themes')
@Controller(ROUTES.ADMIN.PRODUCT_THEMES)
export class ProductThemesController {
  constructor(private readonly service: ProductThemesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product themes (optionally search by name)' })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query('search') search?: string) {
    const result = await this.service.findAll(search);
    return ResponseUtil.success(result, 'Product themes retry successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product theme by ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return ResponseUtil.success(result, 'Product themes retry successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product theme' })
  async create(@Body() dto: CreateProductThemeDto) {
    const result = await this.service.create(dto);
    return ResponseUtil.success(result, 'Product themes created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product theme by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductThemeDto) {
    const result = await this.service.update(id, dto);
    return ResponseUtil.success(result, 'Product themes updated successfully');
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete product theme by ID' })
  async softDelete(@Param('id') id: string) {
    const result = await this.service.softDelete(id);
    return ResponseUtil.success(result, 'Product themes updated successfully');
  }
}
