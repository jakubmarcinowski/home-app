import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { matchRoles } from '../helpers/matchRoles';
import { UserType } from 'src/user/dtos/user.dto';

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const role = request.user?.user_metadata?.role;
    if (!roles || role === UserType.admin) {
      return true;
    }
    return matchRoles(roles, role);
  }
}
