```
 __  __  ___  _____ _____ _     ___     ___ ___  _   _ __  __ 
|  \/  || __|/_ _  |_ _  | |   | | |   / _ \| _ \| | | |  \/  |
| |\/| || |   | |   | |  | |_  |_  _| / /_\ \   / | |_| | |\/| |
|_|  |_||_|_  |_|   |_|  |____| |_|    \___/|_|_\  \___/|_|  |_|

SISTEMA CRUD - INVENTARIO DE INSTRUMENTOS MUSICALES
```

# 🎵 Bienvenido al CRUD de Instrumentos Musicales

## ⚡ ¡Comienza en 30 Segundos!

```bash
# 1. Instalar
npm install

# 2. Crear BD
mkdir -p db

# 3. Ejecutar
npm run start:dev
```

**Tu aplicación estará en: http://localhost:3001**

---

## 📖 Documentación Completa

Este proyecto incluye **9 archivos de documentación** perfectamente organizados:

### 🚀 Punto de Entrada
- **[INDEX.md](INDEX.md)** - Índice central (empieza aquí)

### 📚 Documentación
- [README.md](README.md) - Referencia técnica completa
- [SETUP.md](SETUP.md) - Instalación paso a paso
- [INSTRUCCIONES.md](INSTRUCCIONES.md) - Guía rápida (5 minutos)
- [ARQUITECTURA.md](ARQUITECTURA.md) - Diseño del sistema
- [RESUMEN.md](RESUMEN.md) - Overview del proyecto
- [TREE.md](TREE.md) - Estructura de directorios
- [FINAL.md](FINAL.md) - Resumen visual

### 💻 Ejemplos
- [examples.sh](examples.sh) - Script con ejemplos cURL

---

## 🎯 ¿Qué Necesitas?

| Necesidad | Archivo |
|-----------|---------|
| Instalar proyecto | [SETUP.md](SETUP.md) |
| Entender estructura | [TREE.md](TREE.md) |
| Aprender rápido | [INSTRUCCIONES.md](INSTRUCCIONES.md) |
| Ver ejemplos | [examples.sh](examples.sh) |
| Referencia técnica | [README.md](README.md) |
| Entender el diseño | [ARQUITECTURA.md](ARQUITECTURA.md) |
| Resumen visual | [FINAL.md](FINAL.md) |

---

## ✨ Lo que Incluye

✅ **CRUD Completo** - Create, Read, Update, Delete
✅ **Validaciones Robustas** - Datos seguros
✅ **Base de Datos** - SQLite con TypeORM
✅ **Eventos** - Integración con Event Manager
✅ **API REST** - 8 endpoints principales
✅ **Pruebas** - Suite e2e completa
✅ **Documentación** - 9 archivos .md
✅ **Ejemplos** - Script con casos de uso

---

## 🔥 Inicio Rápido

### Health Check
```bash
curl http://localhost:3001/health
```

### Crear Instrumento
```bash
curl -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Guitarra",
    "tipo": "Cuerda",
    "precio": 200,
    "cantidad": 5
  }'
```

### Listar Todos
```bash
curl http://localhost:3001/instruments
```

---

## 📱 8 Endpoints Principales

```
GET    /                    Info
GET    /health              Estado
POST   /instruments         Crear
GET    /instruments         Listar
GET    /instruments/:id     Obtener uno
PUT    /instruments/:id     Actualizar
DELETE /instruments/:id     Eliminar
GET    /instruments/summary Resumen
```

---

## 🛠️ Scripts Disponibles

```bash
npm run start:dev      # Desarrollo con hot reload
npm run build          # Compilar
npm start:prod         # Producción
npm test               # Pruebas
npm test:e2e           # Pruebas end-to-end
npm run lint           # Verificar código
npm run format         # Formatear código
```

---

## 📂 Estructura

```
src/
├── main.ts                    (Entrada)
├── app.*                      (Aplicación)
├── database/                  (BD)
│   └── entities/
│       └── instrument.entity.ts
└── modules/
    ├── events/                (Eventos)
    └── instruments/           (CRUD)
        ├── instruments.controller.ts
        ├── instruments.service.ts
        └── dto/
```

---

## 🔗 Integración con Event Manager

La app se conecta automáticamente a:
- **Event Manager:** http://localhost:3000/events
- **CRUD App:** http://localhost:3001

Envía eventos en cada operación CRUD.

---

## 🧪 Pruebas

```bash
# Todas
npm test

# End-to-end
npm test:e2e

# Cobertura
npm test:cov
```

---

## 📚 Documentación Recomendada

### Primer Acceso
1. Lee este archivo
2. Abre [INDEX.md](INDEX.md)
3. Sigue [SETUP.md](SETUP.md)

### Para Entender
1. [ARQUITECTURA.md](ARQUITECTURA.md) - Diseño
2. [TREE.md](TREE.md) - Estructura
3. [README.md](README.md) - Referencia

### Para Usar
1. [INSTRUCCIONES.md](INSTRUCCIONES.md) - Guía rápida
2. [examples.sh](examples.sh) - Ejemplos
3. [README.md](README.md) - API completa

---

## ✅ Checklist de Instalación

- [ ] npm install
- [ ] mkdir -p db
- [ ] npm run start:dev
- [ ] curl http://localhost:3001/health (debe devolver 200)
- [ ] Crear un instrumento de prueba
- [ ] Ver todos los instrumentos

---

## 🚀 Siguientes Pasos

1. Instala con [SETUP.md](SETUP.md)
2. Aprende la API con [INSTRUCCIONES.md](INSTRUCCIONES.md)
3. Ejecuta ejemplos en [examples.sh](examples.sh)
4. Lee [ARQUITECTURA.md](ARQUITECTURA.md) para profundizar
5. Modifica código en src/ según necesites

---

## 💡 Tips

- Usa `npm run start:dev` durante desarrollo (hot reload)
- Consulta [README.md](README.md) como referencia rápida
- Ejecuta `npm test:e2e` después de cambios
- Llama a `npm run format` antes de commits

---

## 📞 Necesitas Ayuda?

| Problema | Solución |
|----------|----------|
| "Port already in use" | Ver [SETUP.md](SETUP.md) - Troubleshooting |
| "Cannot find modules" | Ejecuta `npm install` de nuevo |
| "DB locked" | Ver [SETUP.md](SETUP.md) - Troubleshooting |
| "Event Manager error" | Normal, app sigue funcionando |

---

## 🎓 Recursos

- [NestJS Docs](https://nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [SQLite Docs](https://sqlite.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📊 Resumen

```
✅ Aplicación NestJS completa
✅ CRUD funcional y testeado
✅ Base de datos SQLite
✅ Integración de eventos
✅ 9 archivos de documentación
✅ Suite de pruebas e2e
✅ Listo para producción
```

---

## 🎉 ¡Comienza Ahora!

```bash
npm install
mkdir -p db
npm run start:dev
```

**Luego abre cualquier archivo .md según tus necesidades.**

---

**Para información completa, abre [INDEX.md](INDEX.md)**

*Proyecto completado: Fase 1 ✅*
*Listo para Fase 2: Mantenimiento*
