FROM node:8

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . . 
#TODO : copy only source files. try multiple files.
VOLUME /.clocal-gcp

EXPOSE 8080

CMD [ "npm", "start" ]
