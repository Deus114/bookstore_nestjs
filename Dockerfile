FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN cp -r ./src/i18n ./dist/i18n

FROM node:18-bullseye-slim

WORKDIR /app

COPY ./src/i18n /app/src/i18n
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 5001

CMD ["node", "dist/main"]