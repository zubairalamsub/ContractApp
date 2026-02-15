# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build -- --configuration=production

# Runtime stage
FROM nginx:alpine AS runtime

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/dist/contractor-frontend/browser /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
