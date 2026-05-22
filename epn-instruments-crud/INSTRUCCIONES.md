# 🎵 Sistema CRUD de Inventario de Instrumentos Musicales - Guía Rápida

## ⚡ Inicio Rápido (3 pasos)

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Crear Directorio de Base de Datos
```bash
mkdir -p db
```

### Paso 3: Iniciar la Aplicación
```bash
npm run start:dev
```

La aplicación estará disponible en: **http://localhost:3001**

---

## 📱 Operaciones Básicas CRUD

### ✅ CREATE - Crear un Instrumento
```bash
curl -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Guitarra Clásica",
    "tipo": "Cuerda",
    "marca": "Yamaha",
    "precio": 200,
    "cantidad": 5
  }'
```

### 📖 READ - Obtener Instrumentos
```bash
# Todos los instrumentos
curl http://localhost:3001/instruments

# Instrumento específico
curl http://localhost:3001/instruments/1

# Por tipo
curl http://localhost:3001/instruments/type/Cuerda

# Resumen
curl http://localhost:3001/instruments/summary
```

### 🔄 UPDATE - Actualizar Instrumento
```bash
curl -X PUT http://localhost:3001/instruments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 10,
    "condicion": "Excelente"
  }'
```

### 🗑️ DELETE - Eliminar Instrumento
```bash
curl -X DELETE http://localhost:3001/instruments/1
```

---

## 🔗 Integración con Event Manager

La aplicación automáticamente envía eventos al Event Manager en: `http://localhost:3000/events`

**No necesitas hacer nada especial** - los eventos se envían automáticamente en:
- ✅ Cada CREATE
- ✅ Cada UPDATE
- ✅ Cada DELETE
- ✅ Cada QUERY (lectura)

Si el Event Manager no está disponible, la aplicación sigue funcionando normalmente.

---

## 🧪 Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Pruebas e2e
```bash
npm test:e2e
```

### Con cobertura
```bash
npm test:cov
```

---

## 📊 Campos del Instrumento

| Campo | Requerido | Tipo | Ejemplo |
|-------|-----------|------|---------|
| nombre | ✅ | string | "Guitarra Acústica" |
| tipo | ✅ | string | "Cuerda" |
| marca | ❌ | string | "Yamaha" |
| modelo | ❌ | string | "FG-800" |
| precio | ✅ | number | 250.00 |
| cantidad | ✅ | number | 5 |
| descripcion | ❌ | string | "Guitarra de calidad..." |
| condicion | ❌ | string | "Nuevo" |
| ubicacion | ❌ | string | "Estantería A" |

---

## 🎯 Tipos de Instrumento Sugeridos

- 🎸 Cuerda: Guitarra, Bajo, Ukelele, Mandolina
- 🎺 Viento: Flauta, Clarinete, Saxofón, Trompeta
- 🥁 Percusión: Tambor, Platillo, Xilófono
- ⌨️ Teclado: Piano, Órgano, Sintetizador

---

## 🚀 Estructura del Proyecto

```
epn-instruments-crud/
├── src/
│   ├── database/
│   │   └── entities/
│   │       └── instrument.entity.ts
│   ├── modules/
│   │   ├── events/
│   │   │   ├── events.service.ts
│   │   │   └── events.module.ts
│   │   └── instruments/
│   │       ├── dto/
│   │       ├── instruments.controller.ts
│   │       ├── instruments.service.ts
│   │       └── instruments.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── db/
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo con hot reload
npm run start:dev

# Build para producción
npm run build

# Ejecutar en producción
npm run start:prod

# Debug
npm run start:debug

# Linter
npm run lint

# Formatear código
npm run format
```

---

## ❌ Solución de Problemas

### Puerto 3001 ya está en uso
```bash
# Cambiar puerto
PORT=3002 npm run start:dev
```

### No puedo conectar con Event Manager
```
No hay problema, la aplicación seguirá funcionando.
Asegúrate de que Event Manager esté en: http://localhost:3000
```

### Error de base de datos
```bash
# Eliminar y recrear
rm -rf db/instruments.db
mkdir -p db
npm run start:dev
```

---

## 📝 Ejemplo Completo

```bash
# 1. Iniciar aplicación
npm run start:dev

# 2. Crear instrumento
curl -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Guitarra","tipo":"Cuerda","precio":200,"cantidad":5}'

# 3. Ver todos
curl http://localhost:3001/instruments

# 4. Ver resumen
curl http://localhost:3001/instruments/summary

# 5. Actualizar
curl -X PUT http://localhost:3001/instruments/1 \
  -H "Content-Type: application/json" \
  -d '{"cantidad":10}'

# 6. Eliminar
curl -X DELETE http://localhost:3001/instruments/1
```

---

## ✨ Características Destacadas

✅ **CRUD Completo** - Create, Read, Update, Delete
✅ **Validaciones** - Datos seguros y validados
✅ **Integración de Eventos** - Registra todas las operaciones
✅ **Resumen de Inventario** - Valor total, stock por tipo
✅ **Alertas de Stock Bajo** - Items con < 3 unidades
✅ **Base de Datos Persistente** - SQLite
✅ **API REST** - Endpoints claros y RESTful
✅ **Documentación Completa** - Ejemplos y guías

---

## 📞 Soporte

Para más información, consulta `README.md` en la raíz del proyecto.
