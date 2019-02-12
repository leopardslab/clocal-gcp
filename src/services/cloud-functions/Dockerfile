FROM node:6.11-slim

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g @google-cloud/functions-emulator

COPY scripts /usr/src/app/scripts

RUN mkdir /functions

COPY config.json /root/.config/configstore/@google-cloud/functions-emulator/config.json
