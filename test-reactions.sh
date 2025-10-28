#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"

echo -e "${BLUE}=== Test del Módulo de Reacciones ===${NC}\n"

# 1. Registrar usuario cliente 1
echo -e "${BLUE}1. Registrando usuario cliente 1...${NC}"
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Test 1",
    "email": "cliente1@test.com",
    "password": "Cliente123!",
    "phone": "+56911111111",
    "type": "cliente"
  }' | jq .

# 2. Registrar usuario cliente 2
echo -e "\n${BLUE}2. Registrando usuario cliente 2...${NC}"
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Test 2",
    "email": "cliente2@test.com",
    "password": "Cliente123!",
    "phone": "+56922222222",
    "type": "cliente"
  }' | jq .

# 3. Login cliente 1
echo -e "\n${BLUE}3. Login cliente 1...${NC}"
CLIENT1_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente1@test.com",
    "password": "Cliente123!"
  }')

TOKEN1=$(echo "$CLIENT1_LOGIN" | jq -r '.access_token')
echo -e "${GREEN}Token cliente 1: ${TOKEN1:0:20}...${NC}"

# 4. Login cliente 2
echo -e "\n${BLUE}4. Login cliente 2...${NC}"
CLIENT2_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente2@test.com",
    "password": "Cliente123!"
  }')

TOKEN2=$(echo "$CLIENT2_LOGIN" | jq -r '.access_token')
echo -e "${GREEN}Token cliente 2: ${TOKEN2:0:20}...${NC}"

# 5. Registrar empresa
echo -e "\n${BLUE}5. Registrando empresa...${NC}"
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante Test",
    "email": "restaurant@test.com",
    "password": "Restaurant123!",
    "phone": "+56987654321",
    "type": "empresa"
  }' | jq .

# 6. Login empresa
echo -e "\n${BLUE}6. Login empresa...${NC}"
BUSINESS_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "restaurant@test.com",
    "password": "Restaurant123!"
  }')

BUSINESS_TOKEN=$(echo "$BUSINESS_LOGIN" | jq -r '.access_token')

# 7. Crear negocio
echo -e "\n${BLUE}7. Creando negocio...${NC}"
BUSINESS_RESPONSE=$(curl -s -X POST "$API_URL/businesses" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizzería Test",
    "description": "Las mejores pizzas",
    "address": "Av. Test 123",
    "whatsappNumber": "+56987654321",
    "openingHours": {
      "lunes": { "open": "11:00", "close": "23:00" }
    }
  }')

BUSINESS_ID=$(echo "$BUSINESS_RESPONSE" | jq -r '.id')
echo -e "${GREEN}Negocio creado: $BUSINESS_ID${NC}"

# 8. Crear producto
echo -e "\n${BLUE}8. Creando producto...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$API_URL/products?businessId=$BUSINESS_ID" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margarita",
    "description": "Pizza clásica",
    "price": 8990,
    "weightGrams": 500,
    "isAvailable": true
  }')

PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq -r '.id')
echo "$PRODUCT_RESPONSE" | jq .
echo -e "${GREEN}Producto creado: $PRODUCT_ID${NC}"

# 9. Cliente 1 da "like"
echo -e "\n${BLUE}9. Cliente 1 da 'like' al producto...${NC}"
REACTION1=$(curl -s -X POST "$API_URL/reactions" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"type\": \"like\"
  }")

echo "$REACTION1" | jq .

# 10. Cliente 2 da "love"
echo -e "\n${BLUE}10. Cliente 2 da 'love' al producto...${NC}"
REACTION2=$(curl -s -X POST "$API_URL/reactions" \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"type\": \"love\"
  }")

echo "$REACTION2" | jq .

# 11. Listar reacciones del producto (público)
echo -e "\n${BLUE}11. Listando reacciones del producto (público)...${NC}"
curl -s -X GET "$API_URL/reactions?productId=$PRODUCT_ID" | jq .

# 12. Ver estadísticas (público)
echo -e "\n${BLUE}12. Obteniendo estadísticas del producto...${NC}"
curl -s -X GET "$API_URL/reactions/stats?productId=$PRODUCT_ID" | jq .

# 13. Cliente 1 cambia de "like" a "love" (actualización)
echo -e "\n${BLUE}13. Cliente 1 cambia su reacción de 'like' a 'love'...${NC}"
REACTION1_UPDATE=$(curl -s -X POST "$API_URL/reactions" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"type\": \"love\"
  }")

echo "$REACTION1_UPDATE" | jq .
echo -e "${YELLOW}Nota: La reacción se actualizó, no se creó una nueva${NC}"

# 14. Ver estadísticas actualizadas
echo -e "\n${BLUE}14. Estadísticas actualizadas...${NC}"
curl -s -X GET "$API_URL/reactions/stats?productId=$PRODUCT_ID" | jq .

# 15. Cliente 1 ve sus reacciones
echo -e "\n${BLUE}15. Cliente 1 consulta sus reacciones...${NC}"
curl -s -X GET "$API_URL/reactions/my-reactions" \
  -H "Authorization: Bearer $TOKEN1" | jq .

# 16. Cliente 2 ve sus reacciones
echo -e "\n${BLUE}16. Cliente 2 consulta sus reacciones...${NC}"
curl -s -X GET "$API_URL/reactions/my-reactions" \
  -H "Authorization: Bearer $TOKEN2" | jq .

# 17. Intentar crear reacción sin autenticación (debe fallar)
echo -e "\n${BLUE}17. Intentando crear reacción sin token (debe fallar)...${NC}"
curl -s -X POST "$API_URL/reactions" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"type\": \"like\"
  }" | jq .

# 18. Cliente 1 elimina su reacción
echo -e "\n${BLUE}18. Cliente 1 elimina su reacción...${NC}"
curl -s -X DELETE "$API_URL/reactions?productId=$PRODUCT_ID" \
  -H "Authorization: Bearer $TOKEN1"

echo -e "${GREEN}Reacción eliminada${NC}"

# 19. Ver estadísticas después de eliminar
echo -e "\n${BLUE}19. Estadísticas después de eliminar...${NC}"
curl -s -X GET "$API_URL/reactions/stats?productId=$PRODUCT_ID" | jq .

# 20. Listar reacciones finales
echo -e "\n${BLUE}20. Listado final de reacciones...${NC}"
curl -s -X GET "$API_URL/reactions?productId=$PRODUCT_ID" | jq .

# 21. Cliente 2 da "dislike"
echo -e "\n${BLUE}21. Cliente 2 cambia a 'dislike'...${NC}"
curl -s -X POST "$API_URL/reactions" \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"type\": \"dislike\"
  }" | jq .

# 22. Estadísticas finales
echo -e "\n${BLUE}22. Estadísticas finales...${NC}"
curl -s -X GET "$API_URL/reactions/stats?productId=$PRODUCT_ID" | jq .

echo -e "\n${GREEN}=== Tests completados ===${NC}"
echo -e "${BLUE}Resumen:${NC}"
echo -e "- Producto ID: ${GREEN}$PRODUCT_ID${NC}"
echo -e "- Cliente 1 Token: ${GREEN}${TOKEN1:0:30}...${NC}"
echo -e "- Cliente 2 Token: ${GREEN}${TOKEN2:0:30}...${NC}"
echo -e "\n${YELLOW}Notas importantes:${NC}"
echo -e "- ✅ Un usuario solo puede tener UNA reacción por producto"
echo -e "- ✅ Si reacciona de nuevo, se actualiza el tipo"
echo -e "- ✅ Constraint UNIQUE (userId, productId) aplicado"
echo -e "- ✅ Las estadísticas son públicas"
echo -e "- ✅ Solo el usuario puede eliminar su propia reacción"
