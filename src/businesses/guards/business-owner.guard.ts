import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserType } from '../../entities/user.entity';

@Injectable()
export class BusinessOwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.type !== UserType.EMPRESA) {
      throw new ForbiddenException('Solo usuarios de tipo empresa pueden realizar esta acción');
    }

    return true;
  }
}
