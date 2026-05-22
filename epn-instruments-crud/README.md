# EPN Instruments CRUD - Sistema de Inventario de Instrumentos Musicales

## 📋 Descripción

Esta es una aplicación NestJS que implementa un **CRUD completo** para gestionar un inventario de instrumentos musicales. La aplicación se integra con el **EPN Event Manager** para registrar todas las operaciones (CREATE, READ, UPDATE, DELETE).

## 🎯 Características

✅ **CRUD Completo**
- ✔️ CREATE: Crear nuevos instrumentos
- ✔️ READ: Obtener instrumentos (todos, por ID, por tipo)
- ✔️ UPDATE: Actualizar información de instrumentos
- ✔️ DELETE: Eliminar instrumentos

✅ **Gestión de Inventario**
- Seguimiento de cantidad disponible
- Control de precios
- Resumen del inventario con valor total
- Alertas de stock bajo

✅ **Integración con Event Manager**
- Envío automático de eventos para cada operación
- Registro de creaciones, actualizaciones, eliminaciones y consultas
- Trazabilidad completa de cambios

✅ **Validaciones Robustas**
- Validación de datos de entrada
- Control de valores negativos
- Mensajes de error descriptivos

## 🚀 Instalación

1. **Clonar el repositorio:**
```bash
cd epn-instruments-crud
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Crear directorio de base de datos:**
```bash
mkdir -p db
```

## 🏃 Ejecución

### Modo Desarrollo
```bash
npm run start:dev
```

### Modo Producción
```bash
npm run build
npm run start:prod
```

### Modo Debug
```bash
npm run start:debug
```

La aplicación se ejecutará en `http://localhost:3001`

## 📡 API Endpoints

### Obtener información general
```http
GET http://localhost:3001
```

### Health Check
```http
GET http://localhost:3001/health
```

### Crear un instrumento
```http
POST http://localhost:3001/instruments
Content-Type: application/json

{
  "nombre": "Guitarra Acústica",
  "tipo": "Cuerda",
  "marca": "Yamaha",
  "modelo": "FG-800",
  "precio": 250.00,
  "cantidad": 5,
  "descripcion": "Guitarra acústica profesional",
  "condicion": "Nuevo",
  "ubicacion": "Estantería A"
}
```

### Obtener todos los instrumentos
```http
GET http://localhost:3001/instruments
```

### Obtener instrumento por ID
```http
GET http://localhost:3001/instruments/1
```

### Obtener instrumentos por tipo
```http
GET http://localhost:3001/instruments/type/Cuerda
```

### Actualizar un instrumento
```http
PUT http://localhost:3001/instruments/1
Content-Type: application/json

{
  "cantidad": 8,
  "condicion": "Excelente"
}
```

### Actualizar cantidad
```http
PUT http://localhost:3001/instruments/1/quantity?change=3
```

### Obtener resumen del inventario
```http
GET http://localhost:3001/instruments/summary
```
Respuesta:
```json
{
  "totalInstruments": 5,
  "totalValue": 3500.50,
  "instrumentsByType": {
    "Cuerda": 3,
    "Viento": 2
  },
  "lowStockItems": [
    { "id": 2, "nombre": "Flauta", "cantidad": 2, ... }
  ]
}
```

### Eliminar un instrumento
```http
DELETE http://localhost:3001/instruments/1
```

## 📊 Estructura de Base de Datos

### Tabla: instruments
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| nombre | STRING | Nombre del instrumento |
| tipo | STRING | Tipo (Cuerda, Viento, Percusión, etc.) |
| marca | STRING | Marca del instrumento |
| modelo | STRING | Modelo |
| precio | DECIMAL | Precio unitario |
| cantidad | INTEGER | Cantidad disponible |
| descripcion | STRING | Descripción |
| condicion | STRING | Condición (Nuevo, Excelente, Bueno, etc.) |
| fecha_ingreso | DATETIME | Fecha de ingreso al inventario |
| ubicacion | STRING | Ubicación en el almacén |

## 🔗 Integración con Event Manager

La aplicación envía eventos al Event Manager en cada operación:

```json
{
  "source": "instruments-crud",
  "entity": "Instrument",
  "action": "CREATE|UPDATE|DELETE|QUERY",
  "title": "Descripción del evento",
  "description": "Detalles adicionales",
  "payload": { ... }
}
```

### Eventos Enviados

- **CREATE**: Se envía cuando se crea un nuevo instrumento
- **UPDATE**: Se envía cuando se actualiza un instrumento (incluye before/after)
- **DELETE**: Se envía cuando se elimina un instrumento
- **QUERY**: Se envía cuando se realizan consultas

## 🛠️ Scripts Disponibles

```bash
npm run build          # Compilar la aplicación
npm run start          # Iniciar en modo producción
npm run start:dev      # Iniciar en modo desarrollo con watch
npm run start:debug    # Iniciar en modo debug
npm run lint           # Ejecutar linter
npm run format         # Formatear código
npm test               # Ejecutar pruebas
npm test:watch         # Ejecutar pruebas en modo watch
npm test:cov           # Generar reporte de cobertura
npm test:e2e           # Ejecutar pruebas e2e
```

## 📝 Validaciones

- ✅ Nombres de instrumentos requeridos
- ✅ Tipo de instrumento obligatorio
- ✅ Precio no puede ser negativo
- ✅ Cantidad no puede ser negativa
- ✅ No se puede vender más de lo disponible

## 🐛 Manejo de Errores

La aplicación incluye manejo robusto de errores:

```json
{
  "statusCode": 400,
  "message": "La cantidad no puede ser negativa",
  "error": "Bad Request"
}
```

## 📦 Dependencias Principales

- **@nestjs/common**: Framework web
- **@nestjs/typeorm**: ORM para base de datos
- **better-sqlite3**: Base de datos SQLite
- **@nestjs/axios**: Cliente HTTP
- **class-validator**: Validación de DTOs

## 🔐 Variables de Entorno

```env
PORT=3001                              # Puerto de la aplicación
EVENT_MANAGER_URL=http://localhost:3000/events
DATABASE_PATH=db/instruments.db
```

## 📝 Ejemplos de Uso

### Crear varios instrumentos de muestra
```bash
# Crear Guitarra
curl -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Guitarra Acústica",
    "tipo": "Cuerda",
    "marca": "Yamaha",
    "precio": 250,
    "cantidad": 5
  }'

# Crear Flauta
curl -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Flauta Dulce",
    "tipo": "Viento",
    "marca": "Yamaha",
    "precio": 25,
    "cantidad": 15
  }'

# Ver todos
curl http://localhost:3001/instruments

# Ver resumen
curl http://localhost:3001/instruments/summary
```

## 🚨 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Event Manager corriendo en `http://localhost:3000` (opcional, pero recomendado)

## 📌 Notas Importantes

1. La aplicación se sincroniza automáticamente con la base de datos
2. Si el Event Manager no está disponible, la aplicación sigue funcionando normalmente
3. Los eventos se registran pero no detienen las operaciones CRUD
4. La base de datos se almacena en `db/instruments.db`

## 📄 Licencia

UNLICENSED
