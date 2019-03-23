FROM google/cloud-sdk:238.0.0-alpine

# Create app directory
WORKDIR /usr/src/app

COPY scripts /usr/src/app/scripts

RUN apk add --update --no-cache openjdk8-jre
RUN gcloud components install --quiet beta cloud-firestore-emulator

EXPOSE 8086