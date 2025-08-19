# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

# Instala deps
COPY package.json package-lock.json* ./
RUN npm ci

# Prisma client (se usar Prisma)
COPY prisma ./prisma
RUN npx prisma generate || true

# Build TS
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

USER node

EXPOSE 3002
CMD ["node", "dist/index.js"]
