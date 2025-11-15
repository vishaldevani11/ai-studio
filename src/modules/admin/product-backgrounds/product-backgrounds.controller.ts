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
import { ProductBackgroundsService } from './product-backgrounds.service';
import { CreateProductBackgroundDto } from './dto/create-product-background.dto';
import { UpdateProductBackgroundDto } from './dto/update-product-background.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUtil } from '@/common/utils/response.util';

@ApiTags('Admin - Product Backgrounds')
@Controller(ROUTES.ADMIN.PRODUCT_BACKGROUNDS)
export class ProductBackgroundsController {
  constructor(private readonly service: ProductBackgroundsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all product backgrounds (optionally filter by product theme or search)',
  })
  @ApiResponse({ status: 200, description: 'Product backgrounds retrieved successfully' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'productThemeId', required: false, type: String })
  async findAll(
    @Query('search') search?: string,
    @Query('productThemeId') productThemeId?: string,
  ) {
    const result = await this.service.findAll(search, productThemeId);
    return ResponseUtil.success(result, 'Product backgrounds retrieved successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product background by ID' })
  @ApiResponse({ status: 200, description: 'Product background retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return ResponseUtil.success(result, 'Product background retrieved successfully');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product background' })
  @ApiResponse({ status: 201, description: 'Product background created successfully' })
  async create(@Body() dto: CreateProductBackgroundDto) {
    const result = await this.service.create(dto);
    return ResponseUtil.success(result, 'Product background created successfully');
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a product background' })
  @ApiResponse({ status: 200, description: 'Product background updated successfully' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductBackgroundDto) {
    const result = await this.service.update(id, dto);
    return ResponseUtil.success(result, 'Product background updated successfully');
  }

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a product background' })
  @ApiResponse({ status: 200, description: 'Product background soft deleted successfully' })
  async softDelete(@Param('id') id: string) {
    const result = await this.service.softDelete(id);
    return ResponseUtil.success(result, 'Product background updated successfully');
  }
}
