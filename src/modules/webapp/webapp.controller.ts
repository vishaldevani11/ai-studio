import { Controller, Get } from '@nestjs/common';
import { WebAppService } from './webapp.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('WebApp - Public')
@Controller('webapp')
export class WebAppController {
  constructor(private readonly service: WebAppService) {}

  @Get('industries-tree')
  @ApiOperation({
    summary: 'Get all industries with categories, product types, themes, and backgrounds (Public)',
    description:
      'Returns a nested hierarchy of industries → categories → product types → themes → background images, excluding soft-deleted records.',
  })
  @ApiResponse({
    status: 200,
    description: 'Nested data retrieved successfully',
  })
  getIndustriesTree() {
    return this.service.getIndustriesTree();
  }
}
