# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY set-docker-proxy.js ./

RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Change the proxy for Docker
RUN node set-docker-proxy.js

# Start the app
CMD [ "npm", "start" ]
