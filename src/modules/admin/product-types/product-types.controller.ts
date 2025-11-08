import { Controller, Get, Post, Body, Param, Query, Put, Patch } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Product Types')
@Controller('admin/product-types')
export class ProductTypesController {
  constructor(private readonly service: ProductTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product types (optionally filtered by category or name)' })
  findAll(@Query('categoryId') categoryId?: string, @Query('search') search?: string) {
    return this.service.findAll(categoryId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product type by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product type' })
  create(@Body() dto: CreateProductTypeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product type by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateProductTypeDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a product type by ID' })
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
