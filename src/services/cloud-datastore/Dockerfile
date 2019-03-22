FROM google/cloud-sdk:168.0.0-alpine

# Create app directory
WORKDIR /usr/src/app

COPY scripts /usr/src/app/scripts

RUN apk add --update --no-cache openjdk8-jre &&\
    gcloud components install cloud-datastore-emulator beta --quiet

VOLUME /opt/data

EXPOSE 8081