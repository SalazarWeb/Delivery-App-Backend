#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"

echo -e "${BLUE}=== Test del Módulo de Productos ===${NC}\n"

# 1. Registrar usuario empresa
echo -e "${BLUE}1. Registrando usuario empresa...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizzería Test",
    "email": "pizzeria@test.com",
    "password": "Pizza123!",
    "phone": "+56987654321",
    "type": "empresa"
  }')

echo "$REGISTER_RESPONSE" | jq .

# 2. Login
echo -e "\n${BLUE}2. Haciendo login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pizzeria@test.com",
    "password": "Pizza123!"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')

if [ "$TOKEN" = "null" ]; then
  echo -e "${RED}Error: No se pudo obtener el token${NC}"
  exit 1
fi

echo -e "${GREEN}Token obtenido: ${TOKEN:0:20}...${NC}"

# 3. Crear negocio
echo -e "\n${BLUE}3. Creando negocio...${NC}"
BUSINESS_RESPONSE=$(curl -s -X POST "$API_URL/businesses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizzería Roma",
    "description": "Las mejores pizzas de la ciudad",
    "address": "Av. Principal 123",
    "whatsappNumber": "+56987654321",
    "openingHours": {
      "lunes": { "open": "11:00", "close": "23:00" },
      "martes": { "open": "11:00", "close": "23:00" }
    }
  }')

BUSINESS_ID=$(echo "$BUSINESS_RESPONSE" | jq -r '.id')
echo "$BUSINESS_RESPONSE" | jq .

if [ "$BUSINESS_ID" = "null" ]; then
  echo -e "${RED}Error: No se pudo crear el negocio${NC}"
  exit 1
fi

echo -e "${GREEN}Negocio creado: $BUSINESS_ID${NC}"

# 4. Crear producto 1
echo -e "\n${BLUE}4. Creando producto 1 (Pizza Margarita)...${NC}"
PRODUCT1_RESPONSE=$(curl -s -X POST "$API_URL/products?businessId=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margarita",
    "description": "Pizza clásica con tomate, mozzarella y albahaca",
    "weightGrams": 500,
    "quantityUnits": 1,
    "price": 8990,
    "imageUrl": "https://example.com/margarita.jpg",
    "isAvailable": true
  }')

PRODUCT1_ID=$(echo "$PRODUCT1_RESPONSE" | jq -r '.id')
echo "$PRODUCT1_RESPONSE" | jq .

if [ "$PRODUCT1_ID" = "null" ]; then
  echo -e "${RED}Error: No se pudo crear el producto 1${NC}"
  exit 1
fi

echo -e "${GREEN}Producto 1 creado: $PRODUCT1_ID${NC}"

# 5. Crear producto 2
echo -e "\n${BLUE}5. Creando producto 2 (Pizza Pepperoni)...${NC}"
PRODUCT2_RESPONSE=$(curl -s -X POST "$API_URL/products?businessId=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Pepperoni",
    "description": "Pizza con pepperoni y extra queso",
    "weightGrams": 550,
    "price": 9990,
    "isAvailable": true
  }')

PRODUCT2_ID=$(echo "$PRODUCT2_RESPONSE" | jq -r '.id')
echo "$PRODUCT2_RESPONSE" | jq .
echo -e "${GREEN}Producto 2 creado: $PRODUCT2_ID${NC}"

# 6. Listar todos los productos
echo -e "\n${BLUE}6. Listando todos los productos (público)...${NC}"
curl -s -X GET "$API_URL/products" | jq .

# 7. Listar productos del negocio
echo -e "\n${BLUE}7. Listando productos del negocio (filtrado)...${NC}"
curl -s -X GET "$API_URL/products?businessId=$BUSINESS_ID" | jq .

# 8. Obtener un producto específico
echo -e "\n${BLUE}8. Obteniendo producto específico...${NC}"
curl -s -X GET "$API_URL/products/$PRODUCT1_ID" | jq .

# 9. Actualizar producto
echo -e "\n${BLUE}9. Actualizando precio del producto 1...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/products/$PRODUCT1_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 10990,
    "name": "Pizza Margarita Especial"
  }')

echo "$UPDATE_RESPONSE" | jq .

# 10. Marcar como no disponible
echo -e "\n${BLUE}10. Marcando producto 2 como no disponible...${NC}"
curl -s -X PUT "$API_URL/products/$PRODUCT2_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": false
  }' | jq .

# 11. Intentar actualizar sin autenticación (debe fallar)
echo -e "\n${BLUE}11. Intentando actualizar sin token (debe fallar)...${NC}"
FAIL_RESPONSE=$(curl -s -X PUT "$API_URL/products/$PRODUCT1_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1000
  }')

echo "$FAIL_RESPONSE" | jq .

# 12. Registrar usuario cliente
echo -e "\n${BLUE}12. Registrando usuario cliente...${NC}"
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Test",
    "email": "cliente@test.com",
    "password": "Cliente123!",
    "phone": "+56912345678",
    "type": "cliente"
  }' | jq .

# 13. Login como cliente
echo -e "\n${BLUE}13. Login como cliente...${NC}"
CLIENT_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@test.com",
    "password": "Cliente123!"
  }')

CLIENT_TOKEN=$(echo "$CLIENT_LOGIN" | jq -r '.access_token')
echo -e "${GREEN}Cliente token: ${CLIENT_TOKEN:0:20}...${NC}"

# 14. Intentar crear producto como cliente (debe fallar)
echo -e "\n${BLUE}14. Intentando crear producto como cliente (debe fallar)...${NC}"
curl -s -X POST "$API_URL/products?businessId=$BUSINESS_ID" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No debería crearse",
    "price": 1000
  }' | jq .

# 15. Eliminar producto
echo -e "\n${BLUE}15. Eliminando producto 2...${NC}"
curl -s -X DELETE "$API_URL/products/$PRODUCT2_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "${GREEN}Producto eliminado${NC}"

# 16. Verificar que el producto fue eliminado
echo -e "\n${BLUE}16. Intentando obtener producto eliminado (debe fallar)...${NC}"
curl -s -X GET "$API_URL/products/$PRODUCT2_ID" | jq .

# 17. Listar productos finales
echo -e "\n${BLUE}17. Listado final de productos del negocio...${NC}"
curl -s -X GET "$API_URL/products?businessId=$BUSINESS_ID" | jq .

echo -e "\n${GREEN}=== Tests completados ===${NC}"
echo -e "${BLUE}Resumen:${NC}"
echo -e "- Negocio ID: ${GREEN}$BUSINESS_ID${NC}"
echo -e "- Producto 1 ID: ${GREEN}$PRODUCT1_ID${NC}"
echo -e "- Token: ${GREEN}${TOKEN:0:30}...${NC}"
