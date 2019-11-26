FROM node:lts

WORKDIR /usr/webapp

COPY package.json .
RUN yarn
COPY public public/
COPY src src/
EXPOSE 3000
CMD ["yarn", "start"]