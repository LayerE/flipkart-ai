FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY frontend/package*.json ./
COPY frontend/yarn.lock ./

RUN yarn

# Bundle app source
COPY frontend/ .

EXPOSE 3000

CMD [ "yarn", "dev" ]
