# Gordon Dockerfile Generator Skill

## Purpose
This skill provides implementation details for using Docker AI Agent (Gordon) to create and optimize Dockerfiles for Next.js and FastAPI applications, with fallback to standard best-practice Dockerfiles when Gordon is unavailable.

## Capabilities
- Generate multi-stage Dockerfiles for Next.js applications
- Create optimized Dockerfiles for FastAPI applications using python-slim base
- Implement proper file copying with only necessary files for efficient builds
- Include healthchecks and proper port exposure (3000 & 8000)
- Use uv or pip for dependency installation with best practices
- Fallback to standard best-practice Dockerfiles when Gordon is unavailable

## Implementation Details

### Next.js Dockerfile Generation
- Use multi-stage build pattern for optimized images
- Copy only necessary files in each stage to leverage Docker layer caching
- Use appropriate Node.js base image optimized for production
- Install dependencies in a separate layer from application code
- Build application in build stage and copy to production stage
- Expose port 3000 for Next.js applications
- Include healthcheck for container monitoring

### FastAPI Dockerfile Generation
- Use python-slim base image for minimal footprint
- Install dependencies using uv or pip with optimization flags
- Set up proper working directory and user permissions
- Copy requirements first to leverage Docker layer caching
- Install uvicorn for ASGI server functionality
- Expose port 8000 for FastAPI applications
- Include healthcheck for container monitoring

### Healthcheck Implementation
- Implement proper healthcheck commands for both application types
- Use appropriate endpoints or commands to verify application health
- Set reasonable timeouts and intervals for healthchecks

### Fallback Mechanism
- If Gordon Docker AI Agent is unavailable, generate standard best-practice Dockerfiles
- Follow industry-standard patterns for containerization
- Ensure security and performance best practices in fallback implementations

## Usage

### For Next.js Applications:
```dockerfile
# Multi-stage build example
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000/api/health || exit 1
CMD ["node", "server.js"]
```

### For FastAPI Applications:
```dockerfile
FROM python:3.11-slim AS base
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

FROM base AS runtime
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
EXPOSE 8000
HEALTHCHECK CMD curl --fail http://localhost:8000/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```