# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (Leverage Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
