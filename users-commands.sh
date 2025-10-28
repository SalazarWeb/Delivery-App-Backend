#!/bin/bash

# 🚀 Script de Utilidades para el Módulo Users
# Autor: Generado automáticamente
# Fecha: 28 de octubre de 2025

echo "═══════════════════════════════════════════════════════════"
echo "           MÓDULO USERS - COMANDOS ÚTILES"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar estructura del módulo
echo -e "${BLUE}📁 Estructura del módulo users:${NC}"
echo ""
tree src/users -L 2 2>/dev/null || ls -lR src/users
echo ""

# 2. Verificar entidad User
echo -e "${BLUE}📊 Entidad User:${NC}"
echo "src/entities/user.entity.ts"
echo ""

# 3. Tests
echo -e "${BLUE}🧪 Comandos de Testing:${NC}"
echo ""
echo "  # Ejecutar tests del módulo users"
echo "  ${GREEN}pnpm test users${NC}"
echo ""
echo "  # Tests con coverage"
echo "  ${GREEN}pnpm test:cov users${NC}"
echo ""
echo "  # Tests en modo watch"
echo "  ${GREEN}pnpm test:watch users${NC}"
echo ""

# 4. Base de datos
echo -e "${BLUE}🗄️  Comandos de Base de Datos:${NC}"
echo ""
echo "  # Verificar si PostgreSQL está corriendo"
echo "  ${GREEN}sudo systemctl status postgresql${NC}"
echo ""
echo "  # Iniciar PostgreSQL"
echo "  ${GREEN}sudo systemctl start postgresql${NC}"
echo ""
echo "  # Crear la base de datos"
echo "  ${GREEN}sudo -u postgres psql -c \"CREATE DATABASE delivery_db;\"${NC}"
echo ""
echo "  # Conectar a la base de datos"
echo "  ${GREEN}sudo -u postgres psql delivery_db${NC}"
echo ""
echo "  # Ver la tabla users"
echo "  ${GREEN}sudo -u postgres psql -d delivery_db -c \"\\d users\"${NC}"
echo ""

# 5. Desarrollo
echo -e "${BLUE}💻 Comandos de Desarrollo:${NC}"
echo ""
echo "  # Iniciar en modo desarrollo"
echo "  ${GREEN}pnpm start:dev${NC}"
echo ""
echo "  # Build para producción"
echo "  ${GREEN}pnpm build${NC}"
echo ""
echo "  # Iniciar en producción"
echo "  ${GREEN}pnpm start:prod${NC}"
echo ""

# 6. Ejemplos de uso con curl
echo -e "${BLUE}🌐 Ejemplos de API (curl):${NC}"
echo ""
echo "  # Crear un cliente"
echo "  ${GREEN}curl -X POST http://localhost:3000/users \\${NC}"
echo "    ${GREEN}-H \"Content-Type: application/json\" \\${NC}"
echo "    ${GREEN}-d '{${NC}"
echo "      ${GREEN}\"type\": \"cliente\",${NC}"
echo "      ${GREEN}\"name\": \"Juan Pérez\",${NC}"
echo "      ${GREEN}\"phone\": \"+56912345678\",${NC}"
echo "      ${GREEN}\"email\": \"juan@example.com\",${NC}"
echo "      ${GREEN}\"passwordHash\": \"$2b$10$hashedpassword\"${NC}"
echo "    ${GREEN}}'${NC}"
echo ""
echo "  # Buscar por ID"
echo "  ${GREEN}curl http://localhost:3000/users/UUID-AQUI${NC}"
echo ""
echo "  # Buscar por email"
echo "  ${GREEN}curl http://localhost:3000/users/email/juan@example.com${NC}"
echo ""

# 7. Instalación de dependencias opcionales
echo -e "${BLUE}📦 Dependencias Opcionales Recomendadas:${NC}"
echo ""
echo "  # Bcrypt para hashear passwords"
echo "  ${GREEN}pnpm add bcrypt${NC}"
echo "  ${GREEN}pnpm add -D @types/bcrypt${NC}"
echo ""
echo "  # Class Validator para validaciones"
echo "  ${GREEN}pnpm add class-validator class-transformer${NC}"
echo ""
echo "  # Passport para autenticación"
echo "  ${GREEN}pnpm add @nestjs/passport passport passport-local${NC}"
echo "  ${GREEN}pnpm add -D @types/passport-local${NC}"
echo ""
echo "  # JWT para tokens"
echo "  ${GREEN}pnpm add @nestjs/jwt passport-jwt${NC}"
echo "  ${GREEN}pnpm add -D @types/passport-jwt${NC}"
echo ""

# 8. Verificar configuración
echo -e "${BLUE}⚙️  Verificar Configuración:${NC}"
echo ""
echo "  # Verificar variables de entorno"
echo "  ${GREEN}cat .env${NC}"
echo ""
echo "  # Verificar package.json"
echo "  ${GREEN}cat package.json | grep -A 5 dependencies${NC}"
echo ""

# 9. Documentación
echo -e "${BLUE}📚 Documentación:${NC}"
echo ""
echo "  - USERS_MODULE_SUMMARY.md  : Resumen completo del módulo"
echo "  - src/users/README.md      : Documentación del módulo users"
echo "  - TYPEORM_SETUP.md         : Configuración de TypeORM"
echo "  - src/users/users.examples.ts    : Ejemplos de código"
echo "  - src/users/users.architecture.ts : Diagrama de arquitectura"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo -e "${YELLOW}✨ ¡Todo listo para comenzar a desarrollar!${NC}"
echo "═══════════════════════════════════════════════════════════"
