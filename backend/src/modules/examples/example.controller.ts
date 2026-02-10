import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { FeatureGuard } from '../../guards/feature.guard';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { RequireFeature } from '../../decorators/feature.decorator';
import { Permissions, Roles } from '../../decorators/auth.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { EntitlementService } from '../entitlement/entitlement.service';

/**
 * Example controller demonstrating how to use IAM & License features
 */
@ApiTags('Examples - Feature Protection')
@Controller('examples')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExampleController {
  constructor(private entitlementService: EntitlementService) {}

  /**
   * Example 1: Public endpoint - no authentication required
   */
  @Get('public')
  getPublicData() {
    return { message: 'This is public data, no authentication needed' };
  }

  /**
   * Example 2: Protected by JWT only
   */
  @Get('authenticated')
  getAuthenticatedData(@CurrentUser() user: any) {
    return {
      message: 'You are authenticated!',
      user: {
        id: user.id,
        email: user.email,
        organizationId: user.organizationId,
      },
    };
  }

  /**
   * Example 3: Protected by Role
   */
  @Get('admin-only')
  @UseGuards(PermissionsGuard)
  @Roles('admin')
  getAdminData() {
    return { message: 'This endpoint is only for admins' };
  }

  /**
   * Example 4: Protected by Permission
   */
  @Post('create-user')
  @UseGuards(PermissionsGuard)
  @Permissions('users:create')
  createUser() {
    return { message: 'User created (requires users:create permission)' };
  }

  /**
   * Example 5: Protected by Feature (Subscription)
   */
  @Get('api-data')
  @UseGuards(FeatureGuard)
  @RequireFeature('api_access')
  async getApiData(@CurrentUser('organizationId') organizationId: string) {
    // Record usage
    await this.entitlementService.recordUsage(organizationId, 'api_requests');

    return {
      message: 'API data accessed (requires api_access feature)',
      note: 'Usage has been recorded',
    };
  }

  /**
   * Example 6: Protected by Multiple Guards
   */
  @Get('advanced-analytics')
  @UseGuards(PermissionsGuard, FeatureGuard)
  @Roles('admin', 'analyst')
  @RequireFeature('advanced_analytics')
  getAdvancedAnalytics() {
    return {
      message: 'Advanced analytics data',
      requirements: [
        'Must be authenticated',
        'Must have admin or analyst role',
        'Organization must have advanced_analytics feature',
      ],
    };
  }

  /**
   * Example 7: Check feature access programmatically
   */
  @Get('check-features')
  async checkMyFeatures(@CurrentUser('organizationId') organizationId: string) {
    const apiAccess = await this.entitlementService.checkFeatureAccess(
      organizationId,
      'api_access',
    );

    const analytics = await this.entitlementService.checkFeatureAccess(
      organizationId,
      'advanced_analytics',
    );

    const usage = await this.entitlementService.getUsageStats(organizationId);

    return {
      features: {
        apiAccess,
        analytics,
      },
      usage,
    };
  }

  /**
   * Example 8: Quota-based feature with usage tracking
   */
  @Post('send-email')
  @UseGuards(FeatureGuard)
  @RequireFeature('email_notifications')
  async sendEmail(
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    // Check remaining quota
    const access = await this.entitlementService.checkFeatureAccess(
      organizationId,
      'email_notifications',
    );

    if (!access.hasAccess) {
      return {
        success: false,
        message: 'Email quota exceeded for this billing period',
      };
    }

    // Send email (implementation here)
    // ...

    // Record usage
    await this.entitlementService.recordUsage(
      organizationId,
      'email_notifications',
      userId,
      1,
    );

    return {
      success: true,
      message: 'Email sent successfully',
      remaining: access.remaining - 1,
    };
  }
}
