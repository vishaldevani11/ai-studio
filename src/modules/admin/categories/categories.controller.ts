import { ROUTES } from '../../../common/constants';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUtil } from '@/common/utils/response.util';
@ApiTags('Admin - Categories')
@Controller(ROUTES.ADMIN.CATEGORIES)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all categories (optionally filtered by industry or name)' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @ApiQuery({ name: 'industryId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query('industryId') industryId?: string, @Query('search') search?: string) {
    const result = await this.service.findAll(industryId, search);
    return ResponseUtil.success(result, 'Categories retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return ResponseUtil.success(result, 'Category retrieved successfully');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.service.create(dto);
    return ResponseUtil.success(result, 'Category created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const result = await this.service.update(id, dto);
    return ResponseUtil.success(result, 'Category updated successfully');
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete a category by ID' })
  async softDelete(@Param('id') id: string) {
    const result = await this.service.softDelete(id);
    return ResponseUtil.success(result, 'Category soft deleted successfully');
  }
}
