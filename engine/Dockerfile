# --------------------------------------------
# Stage 1: Base image (Debian Slim)
# --------------------------------------------
FROM node:20.12.2-slim AS base

# Install Puppeteer dependencies
RUN apt-get update && \
    apt-get install -y \
    wget \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer configuration
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# --------------------------------------------
# Stage 2: Install ALL dependencies
# --------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --------------------------------------------
# Stage 3: Production dependencies only
# --------------------------------------------
FROM base AS production-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --------------------------------------------
# Stage 4: Build the application
# --------------------------------------------
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build --production

# --------------------------------------------
# Final Stage: Production image
# --------------------------------------------
FROM node:20.12.2-slim
ENV NODE_ENV=production \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Minimal runtime dependencies
RUN apt-get update && \
    apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy production node_modules
COPY --from=production-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/build ./

# Verify server entry point
RUN test -f "./server.js" || test -f "./bin/server.js" || \
    (echo "ERROR: server.js missing!" && find . -name server.js && exit 1)

EXPOSE 3333
CMD ["node", "./bin/server.js"]
