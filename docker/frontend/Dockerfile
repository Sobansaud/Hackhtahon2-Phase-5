# Use node alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps --silent

# Copy the rest of the application
COPY frontend/ .

# Build the Next.js application
RUN npm run build

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]