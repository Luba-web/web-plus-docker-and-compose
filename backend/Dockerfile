FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS production

WORKDIR /app
COPY ./package*.json ./

RUN npm ci --omit=dev && npm i pm2 -g

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js .

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
