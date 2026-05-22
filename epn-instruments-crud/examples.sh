#!/bin/bash

# Script de ejemplos de uso de la API de Instrumentos
# Asegúrate de que la aplicación esté corriendo en http://localhost:3001

BASE_URL="http://localhost:3001"

echo "🎵 Ejemplos de uso de la API de Inventario de Instrumentos Musicales"
echo "=================================================================="
echo ""

# 1. Obtener información de la API
echo "1️⃣  Obtener información de la API:"
echo "curl $BASE_URL"
echo ""

# 2. Health Check
echo "2️⃣  Health Check:"
echo "curl $BASE_URL/health"
echo ""

# 3. Crear instrumento - Guitarra
echo "3️⃣  Crear instrumento - Guitarra:"
curl -X POST "$BASE_URL/instruments" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Guitarra Acústica Yamaha",
    "tipo": "Cuerda",
    "marca": "Yamaha",
    "modelo": "FG-800",
    "precio": 250.00,
    "cantidad": 5,
    "descripcion": "Guitarra acústica profesional",
    "condicion": "Nuevo",
    "ubicacion": "Estantería A"
  }' | jq .
echo ""
echo ""

# 4. Crear instrumento - Flauta
echo "4️⃣  Crear instrumento - Flauta Dulce:"
curl -X POST "$BASE_URL/instruments" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Flauta Dulce",
    "tipo": "Viento",
    "marca": "Yamaha",
    "modelo": "YRS-311",
    "precio": 25.00,
    "cantidad": 15,
    "descripcion": "Flauta dulce de estudiante",
    "condicion": "Nuevo",
    "ubicacion": "Caja 1"
  }' | jq .
echo ""
echo ""

# 5. Crear instrumento - Tambor
echo "5️⃣  Crear instrumento - Tambor:"
curl -X POST "$BASE_URL/instruments" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tambor",
    "tipo": "Percusión",
    "marca": "Ludwig",
    "modelo": "Classic Maple",
    "precio": 500.00,
    "cantidad": 2,
    "descripcion": "Tambor de calidad profesional",
    "condicion": "Excelente",
    "ubicacion": "Pasillo B"
  }' | jq .
echo ""
echo ""

# 6. Obtener todos los instrumentos
echo "6️⃣  Obtener todos los instrumentos:"
curl "$BASE_URL/instruments" | jq .
echo ""
echo ""

# 7. Obtener instrumento por ID
echo "7️⃣  Obtener instrumento por ID (ID=1):"
curl "$BASE_URL/instruments/1" | jq .
echo ""
echo ""

# 8. Obtener instrumentos por tipo
echo "8️⃣  Obtener instrumentos por tipo (Cuerda):"
curl "$BASE_URL/instruments/type/Cuerda" | jq .
echo ""
echo ""

# 9. Actualizar instrumento
echo "9️⃣  Actualizar instrumento (ID=1) - Cambiar cantidad y condición:"
curl -X PUT "$BASE_URL/instruments/1" \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 8,
    "condicion": "Excelente"
  }' | jq .
echo ""
echo ""

# 10. Actualizar cantidad directamente
echo "🔟 Aumentar cantidad en 3 unidades (ID=1):"
curl -X PUT "$BASE_URL/instruments/1/quantity?change=3" | jq .
echo ""
echo ""

# 11. Obtener resumen del inventario
echo "1️⃣1️⃣  Obtener resumen del inventario:"
curl "$BASE_URL/instruments/summary" | jq .
echo ""
echo ""

echo "=================================================================="
echo "✅ Ejemplos completados"
echo ""
echo "Notas:"
echo "- Requiere: jq instalado para formatear JSON"
echo "- Si no tienes jq, elimina '| jq .' del final de cada comando"
echo "- La aplicación debe estar corriendo en puerto 3001"
echo "- El Event Manager debe estar corriendo en puerto 3000 para registrar eventos"
