###########################
# Stage 1: Build Angular Client
###########################
FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build || (echo "Angular build failed!" && exit 1)

# Angular outputs to dist/client/browser/ - flatten this to dist/
RUN if [ -d dist/client/browser ]; then \
      mkdir -p /tmp/dist && \
      cp -r dist/client/browser/* /tmp/dist/ && \
      rm -rf dist && \
      mv /tmp/dist dist; \
    fi

RUN test -f dist/index.html || (echo "ERROR: dist/index.html not found!" && ls -laR dist/ && exit 1)
RUN echo "✓ Client build successful"


###########################
# Stage 2: Build Node Server
###########################
FROM node:20-alpine AS server-build

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server/ .
RUN echo "✓ Server dependencies installed"


###########################
# Stage 3: Runtime Image
###########################
FROM node:20-alpine AS runtime

WORKDIR /app

# Set production mode
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/dist ./client/dist

# Verify client files are present
RUN test -f client/dist/index.html || (echo "ERROR: Client dist not copied!" && ls -laR client/dist && exit 1)
RUN echo "✓ Runtime setup complete - client files ready"

EXPOSE 3000

CMD ["node", "./server/server.js"]
