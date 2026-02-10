import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LicenseService } from './license.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles, Public } from '../../decorators/auth.decorator';
import {
  CreateSubscriptionPlanDto,
  CreateFeatureDto,
  AssignFeatureToPlanDto,
  CreateSubscriptionDto,
  CreateLicenseKeyDto,
} from '../../dtos/license.dto';

@ApiTags('License Management')
@Controller('license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  // ===== SUBSCRIPTION PLANS =====

  @Post('plans')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create subscription plan (Admin only)' })
  async createPlan(
    @Body() createDto: CreateSubscriptionPlanDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.licenseService.createPlan(createDto, userId);
  }

  @Get('plans')
  @Public()
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiQuery({ name: 'public', required: false, type: Boolean })
  async getPlans(@Query('public') isPublic?: boolean) {
    return this.licenseService.getPlans(isPublic);
  }

  @Get('plans/:id')
  @Public()
  @ApiOperation({ summary: 'Get plan by ID' })
  async getPlanById(@Param('id') id: string) {
    return this.licenseService.getPlanById(id);
  }

  // ===== FEATURES =====

  @Post('features')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create feature (Admin only)' })
  async createFeature(
    @Body() createDto: CreateFeatureDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.licenseService.createFeature(createDto, userId);
  }

  @Get('features')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all features' })
  async getFeatures() {
    return this.licenseService.getFeatures();
  }

  // ===== PLAN FEATURES =====

  @Post('plans/features/assign')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign feature to plan (Admin only)' })
  async assignFeatureToPlan(@Body() assignDto: AssignFeatureToPlanDto) {
    return this.licenseService.assignFeatureToPlan(assignDto);
  }

  @Delete('plans/:planId/features/:featureId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove feature from plan (Admin only)' })
  async removeFeatureFromPlan(
    @Param('planId') planId: string,
    @Param('featureId') featureId: string,
  ) {
    return this.licenseService.removeFeatureFromPlan(planId, featureId);
  }

  // ===== SUBSCRIPTIONS =====

  @Post('subscriptions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create subscription (Admin only)' })
  async createSubscription(
    @Body() createDto: CreateSubscriptionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.licenseService.createSubscription(createDto, userId);
  }

  @Get('subscriptions/organization/:organizationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization subscriptions' })
  async getSubscriptionsByOrganization(
    @Param('organizationId') organizationId: string,
  ) {
    return this.licenseService.getSubscriptionsByOrganization(organizationId);
  }

  @Get('subscriptions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription by ID' })
  async getSubscriptionById(@Param('id') id: string) {
    return this.licenseService.getSubscriptionById(id);
  }

  @Post('subscriptions/:id/cancel')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancelSubscription(@Param('id') id: string) {
    return this.licenseService.cancelSubscription(id);
  }

  // ===== LICENSE KEYS =====

  @Post('keys')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate license key (Admin only)' })
  async createLicenseKey(@Body() createDto: CreateLicenseKeyDto) {
    return this.licenseService.createLicenseKey(createDto);
  }

  @Get('keys/validate/:licenseKey')
  @Public()
  @ApiOperation({ summary: 'Validate license key' })
  async validateLicenseKey(@Param('licenseKey') licenseKey: string) {
    return this.licenseService.validateLicenseKey(licenseKey);
  }
}
