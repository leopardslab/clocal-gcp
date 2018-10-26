FROM node:8

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . . 

VOLUME /.clocal-gcp

EXPOSE 8080

CMD [ "npm", "start" ]
