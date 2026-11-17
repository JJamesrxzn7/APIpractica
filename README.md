# APIArqui

API REST N-capas (Express + PostgreSQL + Prisma ORM).

## Pasos
1. Crear tabla y datos: ejecutar `database/schema.sql` y luego `database/inserts_productos.sql`.
2. `npm install`
3. Configurar variables en `.env`: `DATABASE_URL` (o `PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE`), `PORT`, `API_TOKEN` (token por defecto: `secreto123`).
4. Generar el cliente de Prisma: `npx prisma generate`
5. `npm start`

Todas las peticiones requieren `Authorization: Bearer <API_TOKEN>`.

Endpoints: `GET /api/Productos?page=1&limit=100` (limite maximo 100), `GET/PUT/PATCH/DELETE /api/Productos/:id`, `POST /api/Productos`.
