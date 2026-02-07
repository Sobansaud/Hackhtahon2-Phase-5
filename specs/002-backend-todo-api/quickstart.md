# Quickstart: Todo Backend API

## Prerequisites
- Python 3.11+
- Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`

## Environment Setup
Create a `.env` file in the `backend/` directory:
```env
BETTER_AUTH_SECRET=50b256c0aa950f4ac6179c525675a9c27e3d46b941e23cd163c8a7f8d1985dbb
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://neondb_owner:npg_xvPr4G2dLOIc@ep-divine-glitter-a75ayccj-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Local Development
1. Navigate to `backend/`
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlmodel pyjwt asyncpg pydantic-settings
   ```
3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Testing
Run tests using pytest:
```bash
pytest
```
