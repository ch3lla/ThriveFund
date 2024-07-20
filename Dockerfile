FROM node:16

LABEL maintainer="chukwumaemmanuella03@gmail.com"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 3000

CMD [ "node", "index.js" ]