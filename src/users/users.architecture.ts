/**
 * DIAGRAMA DE ARQUITECTURA DEL MÓDULO USERS
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                        APP MODULE                            │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │              TypeORM Configuration                   │   │
 * │  │  - PostgreSQL connection                            │   │
 * │  │  - autoLoadEntities: true                           │   │
 * │  │  - synchronize: true (dev only)                     │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * │                            │                                 │
 * │                            ▼                                 │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │                  USERS MODULE                        │   │
 * │  │  ┌────────────────────────────────────────────┐    │   │
 * │  │  │          UsersController                    │    │   │
 * │  │  │  POST   /users                              │    │   │
 * │  │  │  GET    /users/:id                          │    │   │
 * │  │  │  GET    /users/email/:email                 │    │   │
 * │  │  └────────────────┬───────────────────────────┘    │   │
 * │  │                   │                                  │   │
 * │  │                   ▼                                  │   │
 * │  │  ┌────────────────────────────────────────────┐    │   │
 * │  │  │          UsersService                       │    │   │
 * │  │  │  - create(dto)                              │    │   │
 * │  │  │  - findByEmail(email)                       │    │   │
 * │  │  │  - findById(id)                             │    │   │
 * │  │  └────────────────┬───────────────────────────┘    │   │
 * │  │                   │                                  │   │
 * │  │                   ▼                                  │   │
 * │  │  ┌────────────────────────────────────────────┐    │   │
 * │  │  │      TypeORM Repository<User>               │    │   │
 * │  │  │  - create()                                 │    │   │
 * │  │  │  - save()                                   │    │   │
 * │  │  │  - findOne()                                │    │   │
 * │  │  └────────────────┬───────────────────────────┘    │   │
 * │  └───────────────────┼──────────────────────────────┘   │
 * └────────────────────────┼──────────────────────────────────┘
 *                         │
 *                         ▼
 *          ┌──────────────────────────────┐
 *          │    PostgreSQL Database       │
 *          │                              │
 *          │  Table: users                │
 *          │  ├─ id (uuid, PK)           │
 *          │  ├─ type (enum)             │
 *          │  ├─ name (varchar)          │
 *          │  ├─ phone (varchar)         │
 *          │  ├─ email (varchar, unique) │
 *          │  ├─ passwordHash (varchar)  │
 *          │  └─ createdAt (timestamp)   │
 *          └──────────────────────────────┘
 * 
 * 
 * FLUJO DE DATOS - CREAR USUARIO:
 * ═══════════════════════════════════════════════════════════
 * 
 * 1. Cliente → POST /users + JSON body
 *       │
 *       ▼
 * 2. UsersController.create(@Body() dto)
 *       │
 *       ▼
 * 3. UsersService.create(dto)
 *       │
 *       ▼
 * 4. Repository.create(dto) + Repository.save()
 *       │
 *       ▼
 * 5. PostgreSQL INSERT INTO users...
 *       │
 *       ▼
 * 6. Return User entity ← ← ← ← ← (response)
 * 
 * 
 * FLUJO DE DATOS - BUSCAR POR EMAIL:
 * ═══════════════════════════════════════════════════════════
 * 
 * 1. Cliente → GET /users/email/juan@example.com
 *       │
 *       ▼
 * 2. UsersController.findByEmail(@Param('email'))
 *       │
 *       ▼
 * 3. UsersService.findByEmail(email)
 *       │
 *       ▼
 * 4. Repository.findOne({ where: { email } })
 *       │
 *       ▼
 * 5. PostgreSQL SELECT * FROM users WHERE email = '...'
 *       │
 *       ▼
 * 6. Return User entity or null ← ← ← ← ← (response)
 * 
 * 
 * ENTIDAD USER - ESTRUCTURA:
 * ═══════════════════════════════════════════════════════════
 * 
 * User {
 *   id: string                    // UUID auto-generado
 *   type: 'cliente' | 'empresa'   // Enum UserType
 *   name: string                  // Nombre del usuario/empresa
 *   phone: string                 // Teléfono de contacto
 *   email: string                 // Email único
 *   passwordHash: string          // Password hasheado (bcrypt)
 *   createdAt: Date              // Timestamp auto-generado
 * }
 * 
 * 
 * DTO - CREATE USER:
 * ═══════════════════════════════════════════════════════════
 * 
 * CreateUserDto {
 *   type: UserType                // 'cliente' | 'empresa'
 *   name: string
 *   phone: string
 *   email: string
 *   passwordHash: string
 * }
 * 
 * Nota: id y createdAt se generan automáticamente
 */

export const ARCHITECTURE_DIAGRAM = 'See comments above';
