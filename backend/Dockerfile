FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build \
    && rm -rf ./src/ \
    && rm -rf node ./node_modules/

FROM node:16-alpine as backend
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --no-audit --no-fund --omit=dev \
    && npm i pm2 --no-audit --no-fund -g \
    && npm i @nestjs/config
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js
EXPOSE 4000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]