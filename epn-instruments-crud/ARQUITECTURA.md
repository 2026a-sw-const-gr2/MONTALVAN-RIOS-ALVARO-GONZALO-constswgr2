# 🏗️ ARQUITECTURA - Sistema CRUD de Instrumentos Musicales

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                    APLICACIÓN CLIENTE                               │
│         (Postman, curl, navegador, etc.)                            │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API REST (Puerto 3001)                           │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              app.controller.ts                             │   │
│  │  GET  /                   → Info de la API               │   │
│  │  GET  /health            → Health Check                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              instruments.controller.ts                     │   │
│  │  POST   /instruments              → Crear                │   │
│  │  GET    /instruments              → Listar todos         │   │
│  │  GET    /instruments/:id          → Obtener uno          │   │
│  │  GET    /instruments/type/:tipo   → Por tipo             │   │
│  │  PUT    /instruments/:id          → Actualizar           │   │
│  │  PUT    /instruments/:id/quantity → Cambiar cantidad     │   │
│  │  GET    /instruments/summary      → Resumen              │   │
│  │  DELETE /instruments/:id          → Eliminar             │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  Instruments     │  │  Events          │
        │  Service         │  │  Service         │
        │                  │  │                  │
        │ • create()       │  │ • sendEvent()    │
        │ • findAll()      │  │ • onCreateXX()   │
        │ • findOne()      │  │ • onUpdateXX()   │
        │ • findByTipo()   │  │ • onDeleteXX()   │
        │ • update()       │  │ • onQueryXX()    │
        │ • remove()       │  │                  │
        │ • updateQuantity │  └──────────────────┘
        │ • getInventory   │
        └────────┬─────────┘
                 │
        ┌────────┴────────────────┐
        ▼                         ▼
   ┌─────────────────┐  ┌──────────────────────┐
   │   TypeORM       │  │   HTTP Client        │
   │   Repository    │  │   (Axios)            │
   │                 │  │                      │
   │ • save()        │  │ POST /events         │
   │ • find()        │  │ Event Manager        │
   │ • findOne()     │  │ http://localhost:    │
   │ • remove()      │  │ 3000/events          │
   └────────┬────────┘  └──────────────────────┘
            │
        ┌───┴───┐
        ▼       ▼
    ┌───────────────────┐    ┌──────────────────┐
    │  SQLite Database  │    │ Event Manager    │
    │  (better-sqlite3) │    │ (Puerto 3000)    │
    │                   │    │                  │
    │ db/               │    │ • Recibe eventos │
    │ instruments.db    │    │ • Almacena en    │
    │                   │    │   4 tablas:      │
    │ Tabla:            │    │   - create_e..   │
    │ instruments       │    │   - update_e..   │
    │ • id (PK)         │    │   - delete_e..   │
    │ • nombre          │    │   - query_event  │
    │ • tipo            │    │                  │
    │ • marca           │    │                  │
    │ • modelo          │    │                  │
    │ • precio          │    │                  │
    │ • cantidad        │    │                  │
    │ • descripcion     │    │                  │
    │ • condicion       │    │                  │
    │ • fecha_ingreso   │    │                  │
    │ • ubicacion       │    │                  │
    └───────────────────┘    └──────────────────┘
```

---

## 🔄 Flujo de Operaciones CRUD

### 1️⃣ CREATE - Crear Instrumento

```
Cliente → POST /instruments → Controlador → Validar → Servicio 
→ Guardar en BD → Enviar evento → Responder → Cliente
```

**Evento enviado:**
```json
{
  "source": "instruments-crud",
  "entity": "Instrument",
  "action": "CREATE",
  "title": "Instrumento creado: Guitarra",
  "description": "Se creó un nuevo instrumento de tipo Cuerda",
  "payload": { /* datos del instrumento */ }
}
```

### 2️⃣ READ - Obtener Instrumentos

```
Cliente → GET /instruments → Controlador → Servicio 
→ Consultar BD → Enviar evento QUERY → Responder → Cliente
```

### 3️⃣ UPDATE - Actualizar Instrumento

```
Cliente → PUT /instruments/:id → Controlador → Validar → Servicio
→ Obtener anterior → Actualizar → Enviar evento (before/after)
→ Responder → Cliente
```

### 4️⃣ DELETE - Eliminar Instrumento

```
Cliente → DELETE /instruments/:id → Controlador → Servicio
→ Obtener registro → Eliminar → Enviar evento → Responder → Cliente
```

---

## 📁 Estructura de Directorios

```
epn-instruments-crud/
│
├── src/
│   ├── database/
│   │   ├── database.module.ts          [Módulo BD: TypeORM config]
│   │   └── entities/
│   │       └── instrument.entity.ts    [Mapeo de tabla]
│   │
│   ├── modules/
│   │   ├── events/
│   │   │   ├── events.service.ts       [Servicio de eventos - HTTP]
│   │   │   └── events.module.ts        [Exporta EventsService]
│   │   │
│   │   └── instruments/
│   │       ├── dto/                    [Data Transfer Objects]
│   │       │   ├── create-instrument.dto.ts
│   │       │   └── update-instrument.dto.ts
│   │       ├── instruments.controller.ts  [Endpoints HTTP]
│   │       ├── instruments.service.ts     [Lógica CRUD + Eventos]
│   │       └── instruments.module.ts      [Exporta servicio/controlador]
│   │
│   ├── app.controller.ts               [Rutas /health, /]
│   ├── app.service.ts                  [Servicios de app]
│   ├── app.module.ts                   [Módulo raíz - importa todo]
│   └── main.ts                         [Punto de entrada]
│
├── test/
│   ├── app.e2e-spec.ts                 [Pruebas end-to-end]
│   └── jest-e2e.json                   [Config Jest]
│
├── db/                                 [Carpeta BD (se crea en runtime)]
│   └── instruments.db                  [Base de datos SQLite]
│
├── node_modules/                       [Dependencias]
│
├── dist/                               [Código compilado (build)]
│
├── package.json                        [Dependencias y scripts]
├── package-lock.json                   [Lock file]
├── tsconfig.json                       [Config TypeScript]
├── tsconfig.build.json                 [Config build]
├── nest-cli.json                       [Config NestJS CLI]
├── eslint.config.mjs                   [Config ESLint]
├── .prettierrc                         [Config Prettier]
├── .gitignore                          [Archivos ignorados]
│
├── README.md                           [Documentación técnica]
├── INSTRUCCIONES.md                    [Guía rápida]
├── RESUMEN.md                          [Overview del proyecto]
├── ARQUITECTURA.md                     [Este archivo]
└── examples.sh                         [Ejemplos de cURL]
```

---

## 🔗 Dependencias y Sus Roles

```
@nestjs/common
  └─ Decoradores @Controller, @Get, @Post, @Put, @Delete, etc.

@nestjs/core
  └─ NestFactory para crear la aplicación

@nestjs/platform-express
  └─ Soporte para Express como servidor HTTP

@nestjs/typeorm
  └─ Integración con TypeORM para ORM

@nestjs/axios
  └─ Cliente HTTP para enviar eventos

typeorm
  └─ ORM para gestionar BD

better-sqlite3
  └─ Driver SQLite (almacenamiento)

class-validator
  └─ Validar DTOs

class-transformer
  └─ Transformar objetos
```

---

## 🔒 Capas de Validación

```
Entrada HTTP
    │
    ├─ ValidationPipe (NestJS APP_PIPE)
    │  └─ Valida DTOs con class-validator
    │
    ├─ Controlador
    │  └─ Parsea parámetros (ParseIntPipe)
    │
    └─ Servicio
       ├─ Valida reglas de negocio
       ├─ Verifica existencia de registros
       └─ Valida restricciones (cantidades negativas)
```

---

## 📡 Ciclo de Vida de Evento

```
1. Se ejecuta operación CRUD (create/update/delete)
    │
2. Servicio prepara datos del evento
    │
3. EventsService.sendEvent() es llamado
    │
4. Se construye objeto JSON del evento
    │
5. HTTP POST a http://localhost:3000/events
    │
6. Event Manager recibe y almacena en BD
    │
7. Si falla, se registra error pero CRUD continúa

Flujo no bloqueante: CRUD no espera respuesta del Event Manager
```

---

## 🏅 Patrones de Diseño Usados

### 1. **Inyección de Dependencias**
```typescript
constructor(
  @InjectRepository(InstrumentEntity) 
  private readonly instrumentRepository: Repository<InstrumentEntity>,
  private readonly eventsService: EventsService
) {}
```

### 2. **Data Transfer Objects (DTOs)**
```typescript
export class CreateInstrumentDto {
  @IsString() nombre: string;
  @IsNumber() @Min(0) precio: number;
  // ... validaciones declarativas
}
```

### 3. **Servicios Desacoplados**
```typescript
// Servicios independientes pero conectados
InstrumentsService → EventsService → HttpClient
```

### 4. **Entidades TypeORM**
```typescript
@Entity('instruments')
export class InstrumentEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() nombre: string;
  // ... mapeo automático a base de datos
}
```

---

## 📊 Modelado de Datos

```
┌─────────────────────────────────────┐
│       Instrumento Musicale          │
├─────────────────────────────────────┤
│ id (PK)          : INTEGER          │
│ nombre           : STRING (required)│
│ tipo             : STRING (required)│
│ marca            : STRING           │
│ modelo           : STRING           │
│ precio           : DECIMAL (>= 0)   │
│ cantidad         : INTEGER (>= 0)   │
│ descripcion      : STRING           │
│ condicion        : STRING           │
│ fecha_ingreso    : DATETIME         │
│ ubicacion        : STRING           │
└─────────────────────────────────────┘
```

---

## 🎯 Puntos de Extensión Futura

Para Fase 2 (Mantenimiento), puedes:

1. **Correctivo**: Debugging de eventos no guardados
2. **Adaptativo**: Agregar validaciones de seguridad
3. **Perfectivo**: Agregar índices de BD, caché
4. **Preventivo**: Limitar tamaño de payload, rate limiting

---

## ✨ Resumen Ejecutivo

```
┌─────────────────────────────────────────────────┐
│  SISTEMA CRUD DE INSTRUMENTOS MUSICALES        │
├─────────────────────────────────────────────────┤
│ Lenguaje:        TypeScript                    │
│ Framework:       NestJS 11                     │
│ Base de Datos:   SQLite (better-sqlite3)       │
│ API:             RESTful                       │
│ Validación:      class-validator               │
│ Eventos:         HTTP POST a Event Manager     │
│ Puerto:          3001                          │
│ Ambiente BD:     Local (db/instruments.db)     │
└─────────────────────────────────────────────────┘
```
