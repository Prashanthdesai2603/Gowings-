# Gowings Backend

This is the backend API for Gowings, built with Node.js, Express, TypeScript, and Prisma.

## Local Development Setup

1. **Clone and Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```
   *Note: `DATABASE_URL` is mandatory for the application to run successfully.*

3. **Database Setup (Prisma):**
   Run the following command to generate the Prisma client and push the schema to your local database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5000` (or your configured `PORT`).

## Production Deployment (Render)

This application is configured for easy deployment on [Render](https://render.com).

### Render Configuration

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Required Environment Variables on Render
You must configure the following in the Render dashboard (Environment tab):
- `DATABASE_URL`: Your production MySQL connection string (e.g., from Aiven, PlanetScale, or a custom VPS).
- `JWT_SECRET`: A strong, secure secret string.
- `FRONTEND_URL`: URL of your deployed frontend.
- `PORT`: (Render usually provides this automatically).

### Build Process
The build process automatically handles Prisma generation and database migrations. It will:
1. Generate the Prisma Client.
2. Check for existing migrations and run `npx prisma migrate deploy`. If none exist, it gracefully falls back to `npx prisma db push`.
3. Compile TypeScript to JavaScript.

### Troubleshooting Database Connections

If your application fails to connect to the database in production:
1. **Verify DATABASE_URL**: Ensure it matches exactly what your database provider gave you. Check for special characters in passwords; they must be URL-encoded.
2. **Whitelist Render IP**: If your database is hosted elsewhere, make sure it allows incoming connections from Render.
3. **Database Retry Logic**: The server is designed to retry the database connection 5 times with a 5-second delay. If the database remains unavailable, the server will *not* crash; instead, database-reliant API endpoints will fail gracefully, and the `/health` endpoint will report `Database: Disconnected`.

## API Health Check
You can verify the status of the server and database by hitting:
```
GET /health
```
Response format:
```json
{
  "status": "OK",
  "server": "Running",
  "database": "Connected",
  "environment": "Production"
}
```
