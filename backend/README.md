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
- `DATABASE_URL`: Your production MySQL connection string.
- `PORT`: (Render usually provides this automatically).
- `NODE_ENV`: Must be set to `production`.
- `JWT_SECRET`: A strong, secure secret string.
- `FRONTEND_URL`: URL of your deployed frontend.
- `EMAIL_USER`: Email user for Nodemailer.
- `EMAIL_PASS`: Email password for Nodemailer.

### Example DATABASE_URL format
`mysql://<user>:<password>@<host>:<port>/<database>`

### Prisma Deployment Instructions
The `npm run build` command automatically triggers Prisma client generation. Wait for the build to finish before trying to start the app.
When setting up for the first time, ensure your database schema is up-to-date. You may need to run `npx prisma db push` or `npx prisma migrate deploy` locally pointing to the production database URL, or set up a custom build script to run migrations.

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
