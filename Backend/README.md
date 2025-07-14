# Backend Structure

This backend follows a company-standard, scalable, and maintainable folder structure:

- `src/config/` - Configuration files (env, db, etc.)
- `src/controllers/` - Route controllers (business logic)
- `src/models/` - Database models/schemas
- `src/routes/` - API route definitions
- `src/services/` - Business logic/services (reusable logic)
- `src/middlewares/` - Express middlewares (auth, error handling, etc.)
- `src/utils/` - Utility/helper functions
- `src/validations/` - Request/response validation schemas
- `src/jobs/` - Scheduled/background jobs (if any)
- `src/constants/` - App-wide constants/enums
- `src/types/` - TypeScript types/interfaces (if using TS)
- `src/app.js` - Express app setup
- `src/server.js` - Entry point (server startup)
- `tests/` - Unit/integration tests
- `.env` - Environment variables

This structure is designed for clarity, scalability, and ease of maintenance. 