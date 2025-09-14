# Stage 1: Build ứng dụng
FROM node:18 AS builder

WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Tạo image production
FROM node:18-alpine

WORKDIR /app

# Copy các file cần thiết từ builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Mở cổng 8000 (thay đổi cổng từ 3000 thành 8000)
EXPOSE 8000

# Chạy ứng dụng trên cổng 8000
CMD ["node", "dist/main"]