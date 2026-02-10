import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EntitlementService } from './entitlement.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles } from '../../decorators/auth.decorator';

@ApiTags('Entitlement & Feature Access')
@Controller('entitlements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EntitlementController {
  constructor(private entitlementService: EntitlementService) {}

  @Get('check/:featureCode')
  @ApiOperation({ summary: 'Check if organization has access to a feature' })
  @ApiResponse({
    status: 200,
    description: 'Returns access status and details',
  })
  async checkFeatureAccess(
    @Param('featureCode') featureCode: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.entitlementService.checkFeatureAccess(
      organizationId,
      featureCode,
    );
  }

  @Post('record-usage/:featureCode')
  @ApiOperation({ summary: 'Record usage for a feature' })
  async recordUsage(
    @Param('featureCode') featureCode: string,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body('count') count?: number,
  ) {
    await this.entitlementService.recordUsage(
      organizationId,
      featureCode,
      userId,
      count,
    );
    return { message: 'Usage recorded successfully' };
  }

  @Get('usage/stats')
  @ApiOperation({ summary: 'Get usage statistics for organization' })
  async getUsageStats(@CurrentUser('organizationId') organizationId: string) {
    return this.entitlementService.getUsageStats(organizationId);
  }

  @Post('grant')
  @UseGuards(PermissionsGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Grant custom entitlement to organization (Admin only)',
  })
  async grantEntitlement(
    @Body('organizationId') organizationId: string,
    @Body('featureCode') featureCode: string,
    @Body('value') value?: string,
    @Body('expiresAt') expiresAt?: Date,
  ) {
    return this.entitlementService.grantEntitlement(
      organizationId,
      featureCode,
      value,
      expiresAt,
    );
  }

  @Delete('revoke/:organizationId/:featureCode')
  @UseGuards(PermissionsGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Revoke custom entitlement (Admin only)' })
  async revokeEntitlement(
    @Param('organizationId') organizationId: string,
    @Param('featureCode') featureCode: string,
  ) {
    return this.entitlementService.revokeEntitlement(
      organizationId,
      featureCode,
    );
  }
}
