FROM node:21 AS builder

RUN apt-get clean && apt-get update
RUN apt-get install -y nano
RUN apt-get install -y curl

COPY ["package.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install
RUN npm install -g pm2
RUN npm install -g ts-node
RUN pm2 status

COPY [".", "/usr/src/"]

EXPOSE 3000

