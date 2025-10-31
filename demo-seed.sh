#!/bin/bash

# 🌱 Script de Demostración del Seed
# Este script ejecuta el seed y luego prueba los datos insertados

set -e  # Salir si hay algún error

echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║         🌱 DEMOSTRACIÓN DEL SCRIPT DE SEED            ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
BASE_URL="http://localhost:3000/api"
SEED_EMAIL="empresa@seed.com"
SEED_PASSWORD="Empresa123!"

# Función para imprimir con color
print_step() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# PASO 1: Verificar que pnpm está instalado
print_step "PASO 1: Verificar dependencias"
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm no está instalado"
    echo "Instálalo con: npm install -g pnpm"
    exit 1
fi
print_success "pnpm está instalado"

# PASO 2: Verificar que PostgreSQL está corriendo
print_step "PASO 2: Verificar PostgreSQL"
if ! pg_isready -q; then
    print_error "PostgreSQL no está corriendo"
    print_info "Inicia PostgreSQL con: sudo systemctl start postgresql"
    exit 1
fi
print_success "PostgreSQL está corriendo"

# PASO 3: Ejecutar el seed
print_step "PASO 3: Ejecutar seed"
print_info "Ejecutando: pnpm seed"
echo ""
pnpm seed
echo ""
print_success "Seed ejecutado correctamente"

# PASO 4: Esperar a que el servidor esté listo (si no está corriendo)
print_step "PASO 4: Verificar servidor"
if curl -s "${BASE_URL}/businesses" > /dev/null 2>&1; then
    print_success "Servidor ya está corriendo"
else
    print_info "El servidor no está corriendo"
    print_info "Inicia el servidor con: pnpm start:dev"
    print_info "Luego ejecuta este script de nuevo o prueba manualmente"
    exit 0
fi

# PASO 5: Probar login con el usuario del seed
print_step "PASO 5: Probar login con usuario del seed"
print_info "Email: ${SEED_EMAIL}"
print_info "Password: ${SEED_PASSWORD}"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${SEED_EMAIL}\",\"password\":\"${SEED_PASSWORD}\"}")

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    print_success "Login exitoso"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    print_info "Token obtenido: ${TOKEN:0:20}..."
else
    print_error "Login falló"
    echo "$LOGIN_RESPONSE"
    exit 1
fi
echo ""

# PASO 6: Listar negocios
print_step "PASO 6: Listar negocios creados"
BUSINESSES=$(curl -s "${BASE_URL}/businesses")
echo "$BUSINESSES" | python3 -m json.tool 2>/dev/null || echo "$BUSINESSES"
echo ""

BUSINESS_COUNT=$(echo "$BUSINESSES" | grep -o "\"id\":" | wc -l)
print_success "Negocios encontrados: ${BUSINESS_COUNT}"

if [ "$BUSINESS_COUNT" -gt 0 ]; then
    BUSINESS_ID=$(echo "$BUSINESSES" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    print_info "Primer negocio ID: ${BUSINESS_ID}"
fi
echo ""

# PASO 7: Listar productos
print_step "PASO 7: Listar productos creados"
PRODUCTS=$(curl -s "${BASE_URL}/products")
echo "$PRODUCTS" | python3 -m json.tool 2>/dev/null || echo "$PRODUCTS"
echo ""

PRODUCT_COUNT=$(echo "$PRODUCTS" | grep -o "\"id\":" | wc -l)
print_success "Productos encontrados: ${PRODUCT_COUNT}"
echo ""

# PASO 8: Resumen final
print_step "RESUMEN FINAL"
echo ""
echo "═══════════════════════════════════════════════════════"
print_success "SEED COMPLETADO Y VERIFICADO"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📊 Estadísticas:"
echo "   • Negocios: ${BUSINESS_COUNT}"
echo "   • Productos: ${PRODUCT_COUNT}"
echo ""
echo "🔑 Credenciales del seed:"
echo "   • Email: ${SEED_EMAIL}"
echo "   • Password: ${SEED_PASSWORD}"
echo "   • Token: ${TOKEN:0:30}..."
echo ""
echo "🎯 Próximos pasos:"
echo "   1. Usar el token para endpoints protegidos"
echo "   2. Crear productos adicionales"
echo "   3. Crear un usuario cliente"
echo "   4. Probar reacciones a productos"
echo ""
echo "📚 Documentación:"
echo "   • SEED_README.md - Guía rápida"
echo "   • SEED_DOCUMENTATION.md - Documentación completa"
echo "   • test-api.http - Login seed añadido"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
print_success "¡Todo listo para desarrollar!"
echo ""
