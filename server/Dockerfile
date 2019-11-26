FROM node:lts

WORKDIR /usr/server

COPY package.json .
RUN yarn
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY src src/
EXPOSE 5000
CMD ["yarn", "start:dev"]