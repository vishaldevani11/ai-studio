import { ROUTES } from '../../../common/constants';
import { Controller, Get, Post, Body, Param, Put, Patch, Query } from '@nestjs/common';
import { ProductThemesService } from './product-themes.service';
import { CreateProductThemeDto } from './dto/create-product-theme.dto';
import { UpdateProductThemeDto } from './dto/update-product-theme.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Product Themes')
@Controller(ROUTES.ADMIN.PRODUCT_THEMES)
export class ProductThemesController {
  constructor(private readonly service: ProductThemesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product themes (optionally search by name)' })
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product theme by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product theme' })
  create(@Body() dto: CreateProductThemeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product theme by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateProductThemeDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete product theme by ID' })
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
