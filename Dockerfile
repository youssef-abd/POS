# Use the official Node.js image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies in the backend directory
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the ports the app will run on
EXPOSE 4000
EXPOSE 4001

# Define the command to run the application
CMD ["node", "backend/server.js"]


