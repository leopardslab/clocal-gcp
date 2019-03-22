FROM google/cloud-sdk:162.0.0-alpine

# Create app directory
WORKDIR /usr/src/app

COPY scripts /usr/src/app/scripts

RUN apk --update add openjdk7-jre
RUN gcloud components install --quiet beta pubsub-emulator
RUN mkdir -p /var/pubsub

VOLUME /var/pubsub

EXPOSE 8085
