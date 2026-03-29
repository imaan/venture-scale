FROM node:23-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8080
CMD ["npx", "tsx", "src/server.ts"]
