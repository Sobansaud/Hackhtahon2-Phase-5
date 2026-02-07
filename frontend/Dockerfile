# 1️⃣ Base image
FROM node:18-alpine

# 2️⃣ Working directory
WORKDIR /app

# 3️⃣ Package files copy
COPY package*.json ./

# 4️⃣ Dependencies install
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install

# 5️⃣ Project copy
COPY . .

# 6️⃣ Build Next.js app
RUN npm run build

# 7️⃣ Port expose
EXPOSE 3000

# 8️⃣ App start
CMD ["npm", "start"]