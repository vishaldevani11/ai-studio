import { Controller, Get, Post, Body, Param, Query, Put, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Admin - Categories')
@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories (optionally filtered by industry or name)' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  findAll(@Query('industryId') industryId?: string, @Query('search') search?: string) {
    return this.service.findAll(industryId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a category by ID' })
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
