FROM node:alpine

WORKDIR /app

ENV NODE_ENV production

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

CMD [ "node", "./bot.js" ]