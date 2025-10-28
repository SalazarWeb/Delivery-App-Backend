/**
 * Barrel export for Users module
 * Exporta todos los componentes del módulo users para fácil importación
 */

// Module
export { UsersModule } from './users.module';

// Service
export { UsersService } from './users.service';

// Controller
export { UsersController } from './users.controller';

// DTOs
export { CreateUserDto } from './dto/create-user.dto';

// Re-export entity for convenience
export { User, UserType } from '../entities/user.entity';
