# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
