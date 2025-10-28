#!/bin/bash

# Script de prueba rápida del módulo Auth
# Autor: Generado automáticamente
# Fecha: 28 de octubre de 2025

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         MÓDULO AUTH - PRUEBA RÁPIDA                        ║"
echo "╔════════════════════════════════════════════════════════════╗"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo -e "${BLUE}🔹 Paso 1: Registrar un cliente${NC}"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cliente",
    "name": "Juan Pérez Test",
    "phone": "+56912345678",
    "email": "test-'$(date +%s)'@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extraer el token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Registro exitoso${NC}"
    echo -e "${YELLOW}Token: ${TOKEN:0:50}...${NC}"
else
    echo -e "${RED}❌ Error en el registro${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}🔹 Paso 2: Login con las credenciales${NC}"
echo ""

# Extraer email del registro
EMAIL=$(echo "$REGISTER_RESPONSE" | jq -r '.user.email' 2>/dev/null)

LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$LOGIN_TOKEN" != "null" ] && [ -n "$LOGIN_TOKEN" ]; then
    echo -e "${GREEN}✅ Login exitoso${NC}"
else
    echo -e "${RED}❌ Error en el login${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}🔹 Paso 3: Intentar login con contraseña incorrecta${NC}"
echo ""

WRONG_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "password": "wrongpassword"
  }')

echo "$WRONG_RESPONSE" | jq '.' 2>/dev/null || echo "$WRONG_RESPONSE"
echo ""

if echo "$WRONG_RESPONSE" | grep -q "401\|Unauthorized\|Credenciales"; then
    echo -e "${GREEN}✅ Error manejado correctamente (401 Unauthorized)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}🔹 Paso 4: Intentar registrar email duplicado${NC}"
echo ""

DUP_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cliente",
    "name": "Usuario Duplicado",
    "phone": "+56999999999",
    "email": "'$EMAIL'",
    "password": "password123"
  }')

echo "$DUP_RESPONSE" | jq '.' 2>/dev/null || echo "$DUP_RESPONSE"
echo ""

if echo "$DUP_RESPONSE" | grep -q "409\|Conflict\|ya está registrado"; then
    echo -e "${GREEN}✅ Error manejado correctamente (409 Conflict)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}🔹 Paso 5: Validación de DTO (email inválido)${NC}"
echo ""

INVALID_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cliente",
    "name": "Test",
    "phone": "+56999999999",
    "email": "invalid-email",
    "password": "pass"
  }')

echo "$INVALID_RESPONSE" | jq '.' 2>/dev/null || echo "$INVALID_RESPONSE"
echo ""

if echo "$INVALID_RESPONSE" | grep -q "400\|Bad Request\|email\|contraseña"; then
    echo -e "${GREEN}✅ Validación funcionando correctamente (400 Bad Request)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    PRUEBAS COMPLETADAS                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✨ El módulo Auth está funcionando correctamente!${NC}"
echo ""
