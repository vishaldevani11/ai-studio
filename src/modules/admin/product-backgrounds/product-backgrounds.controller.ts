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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Product Backgrounds')
@Controller(ROUTES.ADMIN.PRODUCT_BACKGROUNDS)
export class ProductBackgroundsController {
  constructor(private readonly service: ProductBackgroundsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all product backgrounds (optionally filter by product theme or search)',
  })
  @ApiResponse({ status: 200, description: 'Product backgrounds retrieved successfully' })
  findAll(@Query('search') search?: string, @Query('productThemeId') productThemeId?: string) {
    return this.service.findAll(search, productThemeId);
  }
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product background by ID' })
  @ApiResponse({ status: 200, description: 'Product background retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product background' })
  @ApiResponse({ status: 201, description: 'Product background created successfully' })
  create(@Body() dto: CreateProductBackgroundDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a product background' })
  @ApiResponse({ status: 200, description: 'Product background updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateProductBackgroundDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a product background' })
  @ApiResponse({ status: 200, description: 'Product background soft deleted successfully' })
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
