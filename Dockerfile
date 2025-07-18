FROM node:18-alpine
WORKDIR /app
COPY package*.json./
RUN npm install
COPY..
RUN apk add --no-cache \
    ffmpeg \
    libwebp \
    imagemagick \
    libcaca

ENV NODE_ENV=product
EXPOSE 3000
CMD ["node", "index.js"]
