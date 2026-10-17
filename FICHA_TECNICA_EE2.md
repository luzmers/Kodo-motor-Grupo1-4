# FICHA TÉCNICA - EVIDENCIA EVALUATIVA 2 (EE2)
## Fundamentos de Desarrollo Back-End
> **Formato de entrega:** Word / PDF  
> **Tipografía:** Arial 12 pt, interlineado 1.5, texto justificado.

---

### 1. NOMBRE DEL PROYECTO
**API REST por Capas con Persistencia MySQL: Módulos de Repuestos y Encuestas de Satisfacción para KODO MOTORS**

---

### 2. INTEGRANTES DEL EQUIPO (5 Integrantes)
- **Integrante 1 (Tú):** [Nombre y Apellidos] — Rol: Arquitectura Base, Servidor Express y Connection Pool MySQL
- **Integrante 2:** [Nombre y Apellidos] — Rol: Módulo Repuestos (Modelo y Repositorio SQL)
- **Integrante 3:** [Nombre y Apellidos] — Rol: Módulo Repuestos (Reglas de Negocio, Controlador y Rutas)
- **Integrante 4:** [Nombre y Apellidos] — Rol: Módulo Encuestas (Modelo y Repositorio con JOIN)
- **Integrante 5:** [Nombre y Apellidos] — Rol: Módulo Encuestas (Reglas de Negocio, Rutas, Pruebas Postman y Documentación)

---

### 3. EMPRESA ALIADA O CASO EMPRESARIAL ASIGNADO
- **Empresa:** KODO MOTORS S.A.C.
- **Descripción:** Concesionaria automotriz autorizada de Mazda en Lima, orientada a la venta de autos, taller de mantenimiento preventivo y venta de repuestos originales. Requiere digitalizar el control de almacén de piezas y medir la satisfacción de clientes post-servicio.

---

### 4. RECURSO O MÓDULOS DESARROLLADOS
1. **Módulo 11 — Repuestos (`/api/repuestos`):** Gestión de inventario de piezas originales, alertas de stock mínimo y control de bajas.
2. **Módulo 12 — Encuestas (`/api/encuestas`):** Registro de encuestas de satisfacción (1 a 5 estrellas) vinculadas a órdenes de servicio entregadas.

---

### 5. ARQUITECTURA BÁSICA DEL BACKEND
Arquitectura por capas estricta:
- **Routes:** Enrutamiento modular con Express Router (`/api/repuestos` y `/api/encuestas`).
- **Controllers:** Manejo de ciclo `req`/`res`, códigos HTTP (200, 201, 400, 404, 500) y captura de errores con `try/catch`.
- **Services:** Lógica de negocio (alerta de stock bajo, bloqueo de eliminación de piezas con stock, validación de que la orden esté 'entregada' e impedimento de encuestas duplicadas).
- **Repositories:** Consultas SQL parametrizadas con placeholders `?` para evitar inyección SQL.
- **Models:** Clases de dominio `Repuesto` y `Encuesta`, casteo de `DECIMAL` a `Number` y validaciones estructurales.
- **Config:** Connection pool con `mysql2/promise` para soportar concurrencia.

---

### 6. DESCRIPCIÓN DE LA BASE DE DATOS UTILIZADA
- **Motor:** MySQL 8.4 (en puerto 3307 mediante Docker Compose o MySQL local)
- **Base de Datos:** `kodo_db`
- **Tablas Principales:**
  - `repuestos`: `id`, `codigo` (UNIQUE), `nombre`, `modelo_compatible`, `stock`, `stock_minimo`, `precio` (DECIMAL), `ubicacion`.
  - `encuestas`: `id`, `orden_id` (UNIQUE FK), `puntuacion` (INT 1-5), `recomendaria` (TINYINT), `comentario`, `created_at`.
  - `ordenes_servicio`: Tabla relacionada de donde se valida el estado `'entregado'`.

---

### 7. TABLA DE ENDPOINTS IMPLEMENTADOS

| Módulo | Método | Endpoint | Códigos HTTP | Descripción |
|---|---|---|---|---|
| Repuestos | **GET** | `/api/repuestos` | 200 OK | Listar inventario (filtros: `?modelo_compatible=`, `?bajo_stock=true`) |
| Repuestos | **GET** | `/api/repuestos/:id` | 200, 400, 404 | Consulta de repuesto por ID |
| Repuestos | **POST** | `/api/repuestos` | 201 Created, 400 | Registro de nueva pieza con código único |
| Repuestos | **PUT** | `/api/repuestos/:id` | 200, 400, 404 | Actualización de stock, precio y ubicación |
| Repuestos | **DELETE** | `/api/repuestos/:id` | 200, 400, 404 | Baja de repuesto (rechazado si `stock > 0`) |
| Encuestas | **GET** | `/api/encuestas` | 200 OK | Listar encuestas (incluye datos del técnico) |
| Encuestas | **GET** | `/api/encuestas/:id` | 200, 400, 404 | Detalle de encuesta por ID |
| Encuestas | **POST** | `/api/encuestas` | 201 Created, 400, 404 | Crear encuesta (solo órdenes entregadas) |
| Encuestas | **PUT** | `/api/encuestas/:id` | 200, 400, 404 | Actualizar calificación o comentario |
| Encuestas | **DELETE** | `/api/encuestas/:id` | 200, 400, 404 | Eliminar encuesta |

---

### 8. CAPTURAS DE PRUEBAS EN POSTMAN
*(Pegar aquí las capturas de la colección `postman/kodo_motors_repuestos_encuestas.postman_collection.json`)*:
- GET `/api/repuestos` (200 OK)
- GET `/api/repuestos?bajo_stock=true` (200 OK con alerta)
- POST `/api/repuestos` (201 Created)
- DELETE `/api/repuestos/2` rechazado por stock > 0 (400 Bad Request)
- POST `/api/encuestas` orden #2 entregada (201 Created)
- POST `/api/encuestas` orden #4 en proceso rechazada (400 Bad Request)

---

### 9. EVIDENCIA DE REGISTROS EN LA BASE DE DATOS
*(Pegar captura de MySQL Workbench o Adminer en `http://localhost:8081`)*:
- `SELECT * FROM repuestos;`
- `SELECT * FROM encuestas;`
Demostración de persistencia tras detener y reiniciar Node.js.

---

### 10. EVIDENCIA DEL REPOSITORIO GITHUB
*(Pegar captura de https://github.com/luzmers/Kodo-motor-Grupo1-4)*:
- Página principal con el `README.md`.
- Red de ramas mostrando las ramas de los 6 integrantes y sus commits.

---

### 11. DIFICULTADES ENCONTRADAS
1. **Integridad referencial en Encuestas**: Controlar que solo se califiquen órdenes existentes y entregadas.
2. **Casteo de tipos DECIMAL**: El driver `mysql2` entregaba el precio como String.
3. **Resolución de conflictos en Git**: Fusión paralela de las ramas de ambos módulos.

---

### 12. SOLUCIONES APLICADAS
1. Se programó validación en `encuestas.service.js` que consulta `ordenes_servicio` antes de insertar.
2. Se implementó `Repuesto.fromRow()` aplicando `Number(row.precio)`.
3. Se acordó un flujo de ramas con Pull Requests y revisión de código en equipo.
