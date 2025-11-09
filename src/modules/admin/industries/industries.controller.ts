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
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Industries')
@Controller('admin/industries')
export class IndustriesController {
  constructor(private readonly service: IndustriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all industries' })
  @ApiResponse({ status: 200, description: 'Industries retrieved successfully' })
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an industry by ID' })
  @ApiResponse({ status: 200, description: 'Industry retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new industry' })
  @ApiResponse({ status: 201, description: 'Industry created successfully' })
  create(@Body() dto: CreateIndustryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an industry by ID' })
  @ApiResponse({ status: 200, description: 'Industry updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateIndustryDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete an industry by ID' })
  @ApiResponse({ status: 200, description: 'Industry soft deleted successfully' })
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
