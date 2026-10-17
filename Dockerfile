# Multi-stage production build for RepairMitra
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY package*.json ./
RUN npm install --omit=dev
COPY server/ ./server/
COPY --from=builder /app/dist ./dist

# Persistent volume directory for SQLite database
VOLUME ["/app/server"]

EXPOSE 5000
CMD ["node", "server/index.js"]
