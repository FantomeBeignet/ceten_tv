### Build Step
FROM node:19-alpine as build

WORKDIR /app

ENV GOOGLE_CLIENT_ID=
ENV GOOGLE_CLIENT_SECRET=
ENV AUTH_SECRET=
ENV USER_WHITELIST=

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

### Serve Step
FROM node:19-alpine

WORKDIR /app

COPY --from=build /app/build .
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "index.js"]