import { ROUTES } from '../../../common/constants';
import {
  Controller,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { LegalDocumentsService } from './legal-documents.service';
import { UpdateLegalDocumentDto } from './dto/update-legal-document.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../database/entities/user.entity';
import { ResponseUtil } from '../../../common/utils/response.util';

@ApiTags('Admin - Legal Documents')
@Controller(ROUTES.ADMIN.LEGAL_DOCUMENTS)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class LegalDocumentsController {
  constructor(private readonly legalDocumentsService: LegalDocumentsService) {}

  @Put('privacy-policy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update privacy policy' })
  @ApiResponse({ status: 200, description: 'Privacy policy updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePrivacyPolicy(@Body() dto: UpdateLegalDocumentDto) {
    const document = await this.legalDocumentsService.updatePrivacyPolicy(dto);
    return ResponseUtil.success(document, 'Privacy policy updated successfully');
  }

  @Put('terms-of-service')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update terms of service' })
  @ApiResponse({ status: 200, description: 'Terms of service updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTermsOfService(@Body() dto: UpdateLegalDocumentDto) {
    const document = await this.legalDocumentsService.updateTermsOfService(dto);
    return ResponseUtil.success(document, 'Terms of service updated successfully');
  }
}

