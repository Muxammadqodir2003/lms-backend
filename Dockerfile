FROM node:20-alpine AS builder
WORKDIR /app

# 1. Zaruriy paketlar
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# 2. Prisma v7 TypeScript konfiguratsiyasini o'qishi uchun ts-node kerak
RUN npm install -g ts-node typescript
RUN npm install --force

COPY . .

# 3. BU YERDA: Prisma 7-da generate qilish uchun URL shart emas, 
# lekin u config faylni ko'rishi shart.
RUN npx prisma generate

RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Builder-dan hamma narsani olib o'tamiz
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Runtime'da TypeScript config'ni o'qish uchun ts-node'ni o'rnatamiz
RUN npm install -g ts-node typescript

EXPOSE 4000

# NODE_OPTIONS Prisma 7-ga .ts config faylini o'qishga yordam beradi
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]