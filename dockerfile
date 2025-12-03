# Use a small, recent Node image
FROM node:20-alpine

# Work in /app
WORKDIR /app

# Copy only root package.json (for the start script) and server package.json
COPY package.json ./
COPY server/package*.json ./server/

# Install server dependencies (from server/package.json)
WORKDIR /app/server
RUN npm install --omit=dev

# Now copy the rest of the source
WORKDIR /app
COPY . .

# Make sure Node sees the right working dir when we run
WORKDIR /app

# Azure will override PORT, but we expose 4300 for local runs
ENV PORT=4300
EXPOSE 4300

# Run the API using the start script we just added
CMD ["npm", "start"]
