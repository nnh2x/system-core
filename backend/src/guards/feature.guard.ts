import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_FEATURE_KEY } from '../decorators/feature.decorator';
import { EntitlementService } from '../modules/entitlement/entitlement.service';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private entitlementService: EntitlementService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.getAllAndOverride<string>(
      REQUIRED_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeature) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.organizationId) {
      throw new ForbiddenException('Organization not found');
    }

    const result = await this.entitlementService.checkFeatureAccess(
      user.organizationId,
      requiredFeature,
    );

    if (!result.hasAccess) {
      throw new ForbiddenException(
        `Your plan does not include access to '${requiredFeature}' feature`,
      );
    }

    return true;
  }
}
