FROM node:lts-alpine

RUN mkdir -p /usr/src/api/node_modules && chown -R node:node /usr/src/api
WORKDIR /usr/src/api

USER node

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .

CMD [ "npm", "run", "start:dev" ]

EXPOSE 3002
