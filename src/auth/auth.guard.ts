import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredLevels = this.reflector.get<number[]>(
        'level',
        context.getHandler(),
      );
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      console.log('User: ', user);

      if (request.path === '/auth/login') {
        return true;
      }

      if (!requiredLevels) {
        return true;
      }

      const hasAuthorization = requiredLevels.some(
        (level) => user.level === level,
      );

      if (!hasAuthorization) {
        throw new ForbiddenException('Not authorized');
      }

      return true;
    } catch (error) {
      console.log('Auth error: ', error);
    }
  }
}
