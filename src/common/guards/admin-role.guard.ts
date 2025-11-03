import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import { IS_PUBLIC_KEY } from '@src/decorator/customize';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminRoleGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Cho phép nếu route được đánh dấu là public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Gọi canActivate của JwtAuthGuard để đảm bảo user đã được authenticate
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Lấy user từ request (đã được set bởi JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    // Kiểm tra role
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException({
        errorCode: 'FORBIDDEN',
      });
    }

    return true;
  }
}
