import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from 'src/interfaces/auth.interface';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): UserProfile => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
