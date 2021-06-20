FROM node:alpine

WORKDIR /app

ENV NODE_ENV production

COPY ./package.json ./

RUN npm install --production

COPY ./api /app/api

COPY ./server.js ./

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

CMD [ "node", "./server.js" ]