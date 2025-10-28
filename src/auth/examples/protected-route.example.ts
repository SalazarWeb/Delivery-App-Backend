import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * EJEMPLO: Cómo proteger rutas con JWT
 * 
 * Este es un ejemplo de cómo usar el guard JwtAuthGuard
 * para proteger rutas que requieren autenticación.
 */
@Controller('profile')
export class ProfileExampleController {
  /**
   * Ruta protegida - requiere token JWT válido
   * GET /profile/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    // El decorador @CurrentUser() inyecta los datos del usuario autenticado
    return {
      message: 'Perfil del usuario autenticado',
      user,
    };
  }

  /**
   * Ruta pública - no requiere autenticación
   * GET /profile/public
   */
  @Get('public')
  getPublicInfo() {
    return {
      message: 'Esta ruta es pública',
    };
  }
}
