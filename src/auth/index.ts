/**
 * Barrel export for Auth module
 */

// Module
export { AuthModule } from './auth.module';

// Service
export { AuthService } from './auth.service';

// Controller
export { AuthController } from './auth.controller';

// DTOs
export { RegisterDto } from './dto/register.dto';
export { LoginDto } from './dto/login.dto';

// Guards
export { JwtAuthGuard } from './guards/jwt-auth.guard';

// Decorators
export { CurrentUser } from './decorators/current-user.decorator';

// Interfaces
export type { AuthResponse, JwtPayload } from './interfaces/auth.interface';

// Strategies
export { JwtStrategy } from './strategies/jwt.strategy';
