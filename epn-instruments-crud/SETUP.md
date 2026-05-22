# 🔧 GUÍA DE INSTALACIÓN Y CONFIGURACIÓN

## ⚡ 3 Pasos Rápidos para Empezar

### Paso 1: Instalar Dependencias (30 segundos)
```bash
cd epn-instruments-crud
npm install
```

### Paso 2: Crear Directorio de Base de Datos (5 segundos)
```bash
mkdir -p db
```

### Paso 3: Iniciar la Aplicación (10 segundos)
```bash
npm run start:dev
```

**✅ ¡Listo!** La aplicación estará en: **http://localhost:3001**

---

## 📋 Instalación Detallada

### Requisitos Previos
- ✅ Node.js >= 18.x
- ✅ npm >= 9.x
- ✅ Git (opcional)

### Verificar Instalación
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version
```

### Descargar/Clonar el Proyecto
```bash
# Si tienes git
git clone <repositorio> epn-instruments-crud
cd epn-instruments-crud

# O, si ya tienes la carpeta
cd epn-instruments-crud
```

### Instalar Dependencias
```bash
npm install
```

Esto instalará:
- NestJS (framework)
- TypeORM (ORM)
- better-sqlite3 (base de datos)
- class-validator (validaciones)
- axios (cliente HTTP)
- Y más...

### Crear Estructura de Directorios
```bash
mkdir -p db
```

---

## 🚀 Ejecutar la Aplicación

### Modo Desarrollo (HOT RELOAD)
```bash
npm run start:dev
```

**Ventajas:**
- ✅ Recarga automática al cambiar archivos
- ✅ Mejor para desarrollo
- ✅ Más información de errores

**Salida esperada:**
```
[Nest] 12345 - 05/21/2026, 10:30:15 AM    LOG [NestFactory] Starting Nest application...
🎵 Servidor de Instrumentos ejecutándose en http://localhost:3001
📡 Conectando con Event Manager en http://localhost:3000/events
✅ Sistema listo para recibir solicitudes CRUD
```

### Modo Producción
```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

### Modo Debug
```bash
npm run start:debug
```

---

## ✅ Verificar que Funciona

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-21T14:30:15.123Z",
  "service": "epn-instruments-crud",
  "version": "1.0.0"
}
```

### Test 2: Crear Instrumento
```bash
curl -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Guitarra",
    "tipo": "Cuerda",
    "precio": 200,
    "cantidad": 5
  }'
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "nombre": "Test Guitarra",
  "tipo": "Cuerda",
  "precio": 200,
  "cantidad": 5,
  "marca": null,
  "modelo": null,
  "descripcion": null,
  "condicion": null,
  "fecha_ingreso": "2026-05-21T14:30:15.123Z",
  "ubicacion": null
}
```

### Test 3: Listar Instrumentos
```bash
curl http://localhost:3001/instruments
```

---

## 🛠️ Comandos Disponibles

```bash
npm run start          # Ejecutar (requiere build previo)
npm run start:dev      # Ejecutar en desarrollo con hot reload
npm run start:debug    # Ejecutar en debug mode
npm run build          # Compilar TypeScript a JavaScript
npm run lint           # Verificar código
npm run format         # Formatear código
npm test               # Ejecutar pruebas unitarias
npm test:watch        # Pruebas con watch
npm test:cov          # Cobertura de pruebas
npm test:e2e          # Pruebas end-to-end
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Port 3001 is already in use"

**Solución 1: Usar puerto diferente**
```bash
PORT=3002 npm run start:dev
```

**Solución 2: Matar proceso en puerto 3001**
```bash
# Windows (PowerShell)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3001
kill -9 <PID>
```

### ❌ Error: "Cannot find module '@nestjs/...'"

**Solución:**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "SQLite database is locked"

**Solución:**
```bash
# Eliminar base de datos y recrear
rm -rf db/instruments.db
npm run start:dev
```

### ❌ Error: "Event Manager connection refused"

**Esto es normal.** La aplicación seguirá funcionando incluso si:
- Event Manager no está disponible
- El puerto 3000 no responde
- Hay error de conexión

Los eventos simplemente no se enviarán, pero el CRUD funcionará perfectamente.

### ❌ Error: "npm: command not found"

**Solución:**
- Verificar que Node.js está instalado: `node --version`
- Reinstalar Node.js desde https://nodejs.org/
- Agregar a PATH si es necesario

---

## 📊 Estructura de Base de Datos

La base de datos se crea automáticamente en `db/instruments.db` con la siguiente estructura:

```sql
CREATE TABLE instruments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR NOT NULL,
    tipo VARCHAR NOT NULL,
    marca VARCHAR,
    modelo VARCHAR,
    precio DECIMAL(10,2) NOT NULL CHECK(precio >= 0),
    cantidad INTEGER DEFAULT 0 CHECK(cantidad >= 0),
    descripcion VARCHAR,
    condicion VARCHAR,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    ubicacion VARCHAR
);
```

### Ver Base de Datos

Con SQLite Browser (GUI):
1. Descargar: https://sqlitebrowser.org/
2. Abrir archivo: `db/instruments.db`
3. Ver datos en tiempo real

---

## 🔗 Integración con Event Manager

### Asegurar que Event Manager esté corriendo
```bash
# En otra terminal/ventana
cd epn-event-manager
npm run start:dev
```

### Event Manager estará en
```
Puerto: 3000
Endpoint: http://localhost:3000/events
```

### Verificar conexión
```bash
curl http://localhost:3000/events
```

---

## 📝 Variables de Entorno (Opcional)

Crear archivo `.env`:
```
PORT=3001
EVENT_MANAGER_URL=http://localhost:3000/events
NODE_ENV=development
```

---

## 📚 Documentación Adicional

Después de instalar, consulta:

1. **README.md** - Documentación técnica completa
2. **INSTRUCCIONES.md** - Guía rápida de API
3. **ARQUITECTURA.md** - Diseño del sistema
4. **examples.sh** - Ejemplos de cURL
5. **RESUMEN.md** - Overview del proyecto

---

## ✨ Próximos Pasos

### 1. Probar la API
```bash
# Ver ejemplos en examples.sh
bash examples.sh
```

### 2. Ejecutar Pruebas
```bash
npm test
npm test:e2e
```

### 3. Desarrollar
```bash
npm run start:dev
# Editar archivos en src/
# Cambios se aplican automáticamente
```

### 4. Compilar para Producción
```bash
npm run build
npm run start:prod
```

---

## 🎯 Verificación Final

Ejecuta esta serie de comandos para verificar que todo funciona:

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Crear instrumento
INSTRUMENT_ID=$(curl -s -X POST http://localhost:3001/instruments \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","tipo":"Cuerda","precio":100,"cantidad":5}' \
  | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

# 3. Ver todos
curl http://localhost:3001/instruments

# 4. Ver resumen
curl http://localhost:3001/instruments/summary

# 5. Eliminar
curl -X DELETE http://localhost:3001/instruments/$INSTRUMENT_ID
```

---

## 📞 Soporte

Si algo no funciona:

1. Verifica que Node.js >= 18.x está instalado
2. Ejecuta `npm install` de nuevo
3. Borra `node_modules` y `package-lock.json`, reinstala
4. Verifica puertos (3001 para app, 3000 para Event Manager)
5. Mira los logs en la terminal

---

## 🎓 Siguientes Pasos - Fase 2

Una vez que el CRUD funciona, trabajarás en:

1. **Mantenimiento Correctivo** 🐞
   - Identificar bugs
   - Corregir errores de lógica

2. **Mantenimiento Adaptativo** ⚙️
   - Nuevas reglas de negocio
   - Cambios de formato

3. **Mantenimiento Perfectivo** 📈
   - Optimizar rendimiento
   - Agregar funcionalidades

4. **Mantenimiento Preventivo** 🛡️
   - Validaciones robustas
   - Manejo de excepciones

---

**¡Listo para desarrollar! 🚀**
