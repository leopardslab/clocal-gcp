FROM node:8

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

VOLUME /.clocal-gcp

EXPOSE 8080

CMD [ "npm", "start" ]