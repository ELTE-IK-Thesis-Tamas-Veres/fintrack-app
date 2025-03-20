# Build stage
FROM node:20 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine as runner
WORKDIR /app
# Copy the build output (update this path based on your actual output directory)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
# Install only production dependencies
RUN npm install --production --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]