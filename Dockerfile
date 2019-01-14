FROM node:latest

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

# Install libraries
RUN npm install -g typescript ts-node tslint
RUN npm install 

# Bundle app source
COPY . .

# Build dist folder

CMD [ "npm", "start" ]

EXPOSE 3000