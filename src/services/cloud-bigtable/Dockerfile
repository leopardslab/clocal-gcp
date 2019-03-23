FROM google/cloud-sdk:238.0.0-alpine

# Create app directory
WORKDIR /usr/src/app

COPY scripts /usr/src/app/scripts

RUN gcloud components install --quiet beta bigtable

EXPOSE 8087