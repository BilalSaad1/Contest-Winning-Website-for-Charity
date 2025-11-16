# Specify the base image
FROM node:20

# Set the working directory to the root of your project inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the React application
COPY client/ ./client/
WORKDIR /app/client

RUN npm install && npm run build

# Copy the server code and built React app to the container
WORKDIR /app
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the application from the root directory
CMD ["node", "Server/index.js"]
