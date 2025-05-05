# Stage 1: Build the app
FROM node:23-alpine AS builder

# Create app directory
WORKDIR /src

# Install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy source files and compile TypeScript
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:23-slim

WORKDIR /src

# Only copy the built output and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Set environment variables (optional)
ENV NODE_ENV=production

# Run the compiled JS app
CMD ["node", "dist/index.js"]
