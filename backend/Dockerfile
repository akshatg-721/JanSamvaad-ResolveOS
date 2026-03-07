FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache eudev
COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./server.js
COPY src ./src
COPY lib ./lib
COPY scripts ./scripts
EXPOSE 3000
CMD ["node", "server.js"]
