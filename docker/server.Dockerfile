FROM node:alpine

WORKDIR /app

ENV NODE_ENV production

ENV DATABASE_HOST db

COPY ./package.json ./

RUN npm install --production

COPY ./api /app/api

COPY ./server.js ./

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

CMD [ "node", "run", "remove-slash-commands" ]

CMD [ "node", "run", "update-slash-commands" ]

CMD [ "node", "./server.js" ]