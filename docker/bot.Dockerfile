FROM node:alpine

WORKDIR /app

ENV API_URL server

COPY ./package.json ./

RUN npm install --production

COPY ./commands /app/commands

COPY ./util /app/util

COPY ./config.js ./

COPY ./.env ./

COPY ./bot.js ./

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

RUN node util/slash_config.js delete

RUN node util/slash_config.js update

CMD [ "node", "./bot.js" ]