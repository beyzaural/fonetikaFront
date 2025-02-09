# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install Expo CLI and ngrok globally
RUN npm install -g expo-cli @expo/ngrok

# Copy the rest of the application files
COPY . .

# Expose necessary ports for Expo
EXPOSE 19000 19001 8081

# Start Expo in tunnel mode
CMD ["npx", "expo", "start", "--tunnel"]
