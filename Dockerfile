# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
# Copy the build output (update this path based on your actual output directory)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]
