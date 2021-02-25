FROM node:latest
WORKDIR /usr/src/api
ADD .sentryclirc .
ADD static static
ADD tsconfig.json .
ADD tsconfig-paths-bootstrap.js .
ADD package.json .
ADD yarn.lock .
ADD utils utils
ADD src src
ADD .env .
RUN yarn install
